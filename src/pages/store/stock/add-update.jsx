import { useAuth } from '@/context/auth';
import {
	useOtherArticleValueLabel,
	useOtherCategoryValueLabel,
	useOtherColorValueLabel,
	useOtherMaterialValueLabel,
	useOtherSizeValueLabel,
	useOtherUnitValueLabel,
} from '@/state/other';
import { useStoreStock } from '@/state/store';
import { useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';
import { STOCK_NULL, STOCK_SCHEMA } from '@/util/Schema';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
	},
	setUpdate,
}) {
	const { user } = useAuth();
	const { url, updateData, postData } = useStoreStock();
	const { data: category } = useOtherCategoryValueLabel();
	const { data: article } = useOtherArticleValueLabel();
	const { invalidateQuery: invalidateMaterialValueLabel } =
		useOtherMaterialValueLabel();
	const { data: color } = useOtherColorValueLabel();
	const { data: size } = useOtherSizeValueLabel();
	const { data: unit } = useOtherUnitValueLabel();
	const { data: material } = useOtherMaterialValueLabel();

	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		context,
	} = useRHF(STOCK_SCHEMA, STOCK_NULL);

	useFetchForRhfReset(`${url}/${update?.uuid}`, update?.uuid, reset);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (update?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${update?.uuid}`,
				uuid: update?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add Item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
			created_by: user?.uuid,
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateMaterialValueLabel();
	};
	// const selectUnit = [
	// 	{ label: 'KG', value: 'kg' },
	// 	{ label: 'Box', value: 'box' },
	// 	{ label: 'Cone', value: 'cone' },
	// 	{ label: 'Meter', value: 'mtr' },
	// 	{ label: 'Pair', value: 'pair' },
	// 	{ label: 'Pak', value: 'pak' },
	// 	{ label: 'Pcs', value: 'pcs' },
	// 	{ label: 'Roll', value: 'roll' },
	// 	{ label: 'S.Fit', value: 's_fit' },
	// 	{ label: 'S.Mtr', value: 's_mtr' },
	// 	{ label: 'Set', value: 'set' },
	// 	{ label: 'Sheet', value: 'sheet' },
	// 	{ label: 'Yard', value: 'yard' },
	// ];

	return (
		<AddModal
			id={modalId}
			title={update?.uuid !== null ? 'Update Material' : 'Material'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			{/* <div className='mb-4 flex flex-col gap-2 md:flex-row'>
				<FormField label='article_uuid' title='Article' errors={errors}>
					<Controller
						name={'article_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Article'
									options={article}
									value={article?.filter(
										(item) =>
											item.value ===
											getValues('article_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										update?.uuid !== null &&
										user.name !== 'Super User'
									}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='category_uuid'
					title='Category'
					errors={errors}>
					<Controller
						name={'category_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Category'
									options={category}
									value={category?.filter(
										(item) =>
											item.value ===
											getValues('category_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										update?.uuid !== null &&
										user.name !== 'Super User'
									}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<FormField label='name_uuid' title='Material' errors={errors}>
				<Controller
					name={'name_uuid'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Material'
								options={material}
								value={material?.filter(
									(item) =>
										item.value === getValues('name_uuid')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									update?.uuid !== null &&
									user.name !== 'Super User'
								}
							/>
						);
					}}
				/>
			</FormField>
			<div className='mb-4 flex flex-col gap-2 md:flex-row'>
				<FormField label='color_uuid' title='Color' errors={errors}>
					<Controller
						name={'color_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Color'
									options={color}
									value={color?.filter(
										(item) =>
											item.value ===
											getValues('color_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										update?.uuid !== null &&
										user.name !== 'Super User'
									}
								/>
							);
						}}
					/>
				</FormField>

				<FormField label='size_uuid' title='Size' errors={errors}>
					<Controller
						name={'size_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Size'
									options={size}
									value={size?.filter(
										(item) =>
											item.value ===
											getValues('size_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										update?.uuid !== null &&
										user.name !== 'Super User'
									}
								/>
							);
						}}
					/>
				</FormField>

				<FormField label='unit_uuid' title='Unit' errors={errors}>
					<Controller
						name={'unit_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Unit'
									options={unit}
									value={unit?.filter(
										(item) =>
											item.value ===
											getValues('unit_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										update?.uuid !== null &&
										user.name !== 'Super User'
									}
								/>
							);
						}}
					/>
				</FormField> */}
			{/* <FormField label='unit' title='Unit' errors={errors}>
					<Controller
						name={'unit'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Unit'
									options={selectUnit}
									value={selectUnit?.filter(
										(item) =>
											item.value === getValues('unit')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={
										update?.uuid !== null &&
										user.name !== 'Super User'
									}
								/>
							);
						}}
					/>
				</FormField> */}
			{/* </div> */}
			<div className='mb-4 flex flex-col gap-2 md:flex-row'>
				<Textarea label='remarks' rows={2} {...{ register, errors }} />
			</div>
			<DevTool control={control} />
		</AddModal>
	);
}
