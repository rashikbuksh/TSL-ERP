import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useOtherArticleValueLabel,
	useOtherCategoryValueLabel,
	useOtherColorValueLabel,
	useOtherMaterialValueLabel,
	useOtherSizeValueLabel,
	useOtherUnitValueLabel,
} from '@/state/other';
import {
	useStoreReceive,
	useStoreReceiveEntry,
	useStoreReceiveEntryByDetails,
	useStoreStock,
} from '@/state/store';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { configure, HotKeys } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import {
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
	Textarea,
} from '@/ui';

import nanoid from '@/lib/nanoid';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';
import { RECEIVE_NULL, RECEIVE_SCHEMA } from '@/util/Schema';

import Header from './header';

export default function Index() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { receive_entry_description_uuid } = useParams();
	const { data, invalidateQuery: invalidateEntryByDetails } =
		useStoreReceiveEntryByDetails(receive_entry_description_uuid);
	const { url: receive_entryEntryUrl, invalidateQuery: invalidateEntry } =
		useStoreReceiveEntry();
	const {
		url: receive_entryDescriptionUrl,
		updateData,
		postData,
		deleteData,
	} = useStoreReceive();

	const { data: material } = useOtherMaterialValueLabel();
	const { data: category } = useOtherCategoryValueLabel();
	const { data: article } = useOtherArticleValueLabel();
	const { data: color } = useOtherColorValueLabel();
	const { data: size } = useOtherSizeValueLabel();
	const { data: unit } = useOtherUnitValueLabel();
	const { invalidateQuery: invalidateStock } = useStoreStock();

	useEffect(() => {
		receive_entry_description_uuid !== undefined
			? (document.title =
					'Update Receive Entry: ' + receive_entry_description_uuid)
			: (document.title = 'Receive Entry');
	}, []);

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
	} = useRHF(RECEIVE_SCHEMA, RECEIVE_NULL);

	const isUpdate = receive_entry_description_uuid !== undefined;
	// isUpdate &&
	// 	useFetchForRhfReset(
	// 		`/store/receive-entry-details/by/${receive_entry_description_uuid}`,
	// 		receive_entry_description_uuid,
	// 		reset
	// 	);

	// receive_entry
	const {
		fields: receiveEntry,
		append: receiveEntryAppend,
		remove: receiveEntryRemove,
	} = useFieldArray({
		control,
		name: 'receive_entry',
	});
	useEffect(() => {
		if (data !== undefined && isUpdate) {
			reset(data);
		}
	}, [data, isUpdate]);
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleReceiveEntryRemove = (index) => {
		if (getValues(`receive_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`receive_entry[${index}].uuid`),
				itemName: getValues(`receive_entry[${index}].material_name`),
			});
			window['receive_entry_delete'].showModal();
		}
	};

	const handelReceiveEntryAppend = () => {
		receiveEntryAppend({
			material_uuid: '',
			article_uuid: '',
			category_uuid: '',
			color_uuid: '',
			size_uuid: '',
			unit_uuid: '',
			quantity: '',
			price: '',
			remarks: '',
		});
	};

	let excludeItem = exclude(
		watch,
		material,
		'receive_entry',
		'material_uuid'
	);
	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const receive_entry_description_data = {
				...data,
				receive_uuid: receive_entry_description_uuid,
				updated_at: GetDateTime(),
			};
			delete receive_entry_description_data['receive_entry'];
			const receive_entry_description_promise =
				await updateData.mutateAsync({
					url: `${receive_entryDescriptionUrl}/${data?.uuid}`,
					updatedData: receive_entry_description_data,
					uuid: data.uuid,
					isOnCloseNeeded: false,
				});

			const receive_entry_entries_promise = data.receive_entry.map(
				async (item) => {
					if (item.uuid === undefined || item.uuid === null) {
						item.receive_uuid = receive_entry_description_uuid;
						item.created_at = GetDateTime();
						item.created_by = user?.uuid;
						item.uuid = nanoid();
						return await postData.mutateAsync({
							url: receive_entryEntryUrl,
							newData: item,
							isOnCloseNeeded: false,
						});
					} else {
						item.updated_at = GetDateTime();
						const updatedData = {
							...item,
						};
						return await updateData.mutateAsync({
							url: `${receive_entryEntryUrl}/${item.uuid}`,
							uuid: item.uuid,
							updatedData,
							isOnCloseNeeded: false,
						});
					}
				}
			);

			try {
				await Promise.all([
					receive_entry_description_promise,
					...receive_entry_entries_promise,
				])
					.then(() => reset(RECEIVE_NULL))
					.then(() => {
						invalidateStock();
						invalidateEntry();
						navigate(
							`/store/receive/${receive_entry_description_uuid}`
						);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_receive_entry_description_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create receive_entry description
		const receive_entry_description_data = {
			...data,
			uuid: new_receive_entry_description_uuid,
			created_at,
			created_by,
		};

		// delete receive_entry field from data to be sent
		delete receive_entry_description_data['receive_entry'];

		const receive_entry_description_promise = await postData.mutateAsync({
			url: receive_entryDescriptionUrl,
			newData: receive_entry_description_data,
			isOnCloseNeeded: false,
		});

		// Create receive_entry entries
		const receive_entry_entries = [...data.receive_entry].map((item) => ({
			...item,
			receive_uuid: new_receive_entry_description_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const receive_entry_entries_promise = [
			...receive_entry_entries.map(
				async (item) =>
					await postData.mutateAsync({
						url: receive_entryEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		try {
			await Promise.all([
				receive_entry_description_promise,
				...receive_entry_entries_promise,
			])
				.then(() => reset(RECEIVE_NULL))
				.then(() => {
					invalidateStock();
					invalidateEntry();
					navigate(
						`/store/receive/${new_receive_entry_description_uuid}`
					);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	// Check if id is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
	};

	const handlers = {
		NEW_ROW: handelReceiveEntryAppend,
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide px-3 py-2';

	const getTotalPrice = useCallback(
		(receive_entry) =>
			receive_entry?.reduce((acc, item) => {
				return acc + Number(item.price) * Number(item.quantity);
			}, 0),
		[watch()]
	);

	return (
		<>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col'>
					<div className='space-y-6'>
						<Header
							{...{
								register,
								errors,
								control,
								getValues,
								Controller,
								watch,
								setValue,
							}}
						/>

						<DynamicField
							title='Details'
							handelAppend={handelReceiveEntryAppend}
							tableHead={[
								'Material',
								'Article',
								'Category',
								'Color',
								'Size',
								'Quantity',
								'Unit',
								'Unit Price',
								'Price',
								'Price(BDT)',
								'Remarks',
								'Action',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-4 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
									{item}
								</th>
							))}>
							{receiveEntry.map((item, index) => (
								<tr key={item.id}>
									{/* Material Name */}
									<td className={`w-48`}>
										<FormField
											label={`receive_entry[${index}].name_uuid`}
											title='Material'
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													.name_uuid
											}>
											<Controller
												name={`receive_entry[${index}].name_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Material'
															options={material}
															value={material?.filter(
																(inItem) =>
																	inItem.value ==
																	getValues(
																		`receive_entry[${index}].name_uuid`
																	)
															)}
															onChange={(e) => {
																onChange(
																	e.value
																);
															}}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>
									{/* Article */}
									<td className={`w-48`}>
										<FormField
											label={`receive_entry[${index}].article_uuid`}
											title='Article'
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													.article_uuid
											}>
											<Controller
												name={`receive_entry[${index}].article_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Article'
															options={article}
															value={article?.filter(
																(inItem) =>
																	inItem.value ==
																	getValues(
																		`receive_entry[${index}].article_uuid`
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>

									{/* Category */}
									<td className={`w-48`}>
										<FormField
											label={`receive_entry[${index}].category_uuid`}
											title='Category'
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													.category_uuid
											}>
											<Controller
												name={`receive_entry[${index}].category_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Category'
															options={category}
															value={category?.filter(
																(inItem) =>
																	inItem.value ==
																	getValues(
																		`receive_entry[${index}].category_uuid`
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>

									{/* Color */}
									<td className={`w-48`}>
										<FormField
											label={`receive_entry[${index}].color_uuid`}
											title='Color'
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													.color_uuid
											}>
											<Controller
												name={`receive_entry[${index}].color_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Color'
															options={color}
															value={color?.filter(
																(inItem) =>
																	inItem.value ==
																	getValues(
																		`receive_entry[${index}].color_uuid`
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>

									{/* Size */}
									<td className={`w-48`}>
										<FormField
											label={`receive_entry[${index}].size_uuid`}
											title='Size'
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													.size_uuid
											}>
											<Controller
												name={`receive_entry[${index}].size_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Size'
															options={size}
															value={size?.filter(
																(inItem) =>
																	inItem.value ==
																	getValues(
																		`receive_entry[${index}].size_uuid`
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>
									<td className={`w-48`}>
										<Input
											title='quantity'
											label={`receive_entry[${index}].quantity`}
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													?.quantity
											}
											register={register}
										/>
									</td>
									<td className={`w-48`}>
										<FormField
											label={`receive_entry[${index}].unit_uuid`}
											title='Unit'
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													.unit_uuid
											}
											errors={errors}>
											<Controller
												name={`receive_entry[${index}].unit_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															placeholder='Select Unit'
															options={unit}
															value={unit?.filter(
																(inItem) =>
																	inItem.value ==
																	getValues(
																		`receive_entry[${index}].unit_uuid`
																	)
															)}
															onChange={(e) =>
																onChange(
																	e.value
																)
															}
															menuPortalTarget={
																document.body
															}
														/>
													);
												}}
											/>
										</FormField>
									</td>
									<td className={`w-48`}>
										<Input
											title='price'
											label={`receive_entry[${index}].price`}
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													?.price
											}
											register={register}
										/>
									</td>
									<td className={`w-48`}>
										{`${(watch(`receive_entry[${index}].quantity`) * watch(`receive_entry[${index}].price`)).toLocaleString()}`}
									</td>
									<td className={`w-48`}>
										{`${(watch(`receive_entry[${index}].quantity`) * watch(`receive_entry[${index}].price`) * watch('convention_rate')).toLocaleString()}`}
									</td>
									<td className={`w-48`}>
										<Textarea
											title='remarks'
											label={`receive_entry[${index}].remarks`}
											is_title_needed='false'
											dynamicerror={
												errors?.receive_entry?.[index]
													?.remarks
											}
											register={register}
										/>
									</td>
									<td className={`w-12 pl-0`}>
										<RemoveButton
											className={'justify-center'}
											onClick={() =>
												handleReceiveEntryRemove(index)
											}
											showButton={receiveEntry.length > 1}
										/>
									</td>
								</tr>
							))}
							<tr className='border-t border-primary/30'>
								<td
									className='px-3 py-2 text-right font-bold'
									colSpan='8'>
									Total:
								</td>
								<td className='px-3 py-2 font-bold'>
									{getTotalPrice(
										watch('receive_entry')
									).toLocaleString()}
								</td>
								<td className='px-3 py-2 font-bold'>
									{(
										getTotalPrice(watch('receive_entry')) *
										watch('convention_rate')
									).toLocaleString()}
								</td>
								<td className='px-3 py-2 font-bold'></td>
							</tr>
						</DynamicField>
					</div>

					<div className='modal-action'>
						<button
							type='submit'
							className='text-md btn btn-primary btn-block rounded'>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={'receive_entry_delete'}
					title={'Receive Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={receiveEntry}
					url={receive_entryEntryUrl}
					deleteData={deleteData}
					invalidateQueryArray={[
						invalidateEntryByDetails,
						invalidateStock,
					]}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</>
	);
}
