import { useMemo } from 'react';

import { DateTime, EditDelete, LinkOnly, Transfer } from '@/ui';

import { DEFAULT_COLUMNS } from '@/util/table/default-columns';

export const LibraryCommonColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};
export const ArticleColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};

export const VendorColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'person',
				header: 'Person',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'address',
				header: 'Address',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			...DEFAULT_COLUMNS({ handelUpdate, handelDelete, haveAccess }),
		],
		[data]
	);
};
export const StockColumns = ({
	handelUpdate,
	handelDelete,
	handleIssue,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'article_name',
				header: 'Article',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'category_name',
				header: 'Category',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_name',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size_name',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => (info.getValue() ? info.getValue() : '-'),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_name',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_trx',
				header: 'Issue',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('click_issue'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handleIssue(info.row.index)} />
				),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess?.includes('update') &&
					!haveAccess?.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showUpdate={haveAccess?.includes('update')}
						showDelete={haveAccess?.includes('delete')}
					/>
				),
			},
		],
		[data]
	);
};

export const IssueLogColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'article_name',
				header: 'Article',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'category_name',
				header: 'Category',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_name',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},

			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess?.includes('click_issue_update') &&
					!haveAccess?.includes('click_issue_delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showUpdate={haveAccess?.includes('click_issue_update')}
						showDelete={haveAccess?.includes('click_issue_delete')}
					/>
				),
			},
		],
		[data]
	);
};
export const ReceiveLogColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	return useMemo(
		() => [
			{
				accessorKey: 'receive_id',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => {
					const { receive_uuid } = info?.row?.original;
					return (
						<LinkOnly
							uri='/store/receive'
							id={receive_uuid}
							title={info?.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'vendor_name',
				header: 'Vendor',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'article_name',
				header: 'Article',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'category_name',
				header: 'Category',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_name',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size_name',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_name',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'price',
				header: 'Unit Price',
				enableColumnFilter: false,
				cell: (info) => info.getValue().toLocaleString(),
			},

			{
				id: 'total_price_usd',
				accessorFn: (row) =>
					(row.price * row.quantity).toLocaleString(),
				header: (
					<>
						Total Price <br /> (USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				id: 'total_price_bdt',
				accessorFn: (row) =>
					(
						row.price *
						row.quantity *
						row.convention_rate
					).toLocaleString(),
				header: (
					<>
						Total Price <br /> (BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess?.includes('click_receive_update') &&
					!haveAccess?.includes('click_receive_delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showUpdate={haveAccess?.includes(
							'click_receive_update'
						)}
						showDelete={haveAccess?.includes(
							'click_receive_delete'
						)}
					/>
				),
			},
		],
		[data]
	);
};
export const ReceiveColumns = ({
	handelUpdate,
	handelDelete,
	haveAccess,
	data,
}) => {
	console.log(haveAccess);
	return useMemo(
		() => [
			{
				accessorKey: 'receive_id',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkOnly
							uri='/store/receive'
							id={uuid}
							title={info.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'vendor_name',
				header: 'Vendor',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'is_import',
				header: 'Local/Import',
				enableColumnFilter: false,
				cell: (info) => {
					return info.getValue() === 1 ? 'Import' : 'Local';
				},
			},
			{
				accessorKey: 'lc_number',
				header: 'LC',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'commercial_invoice_number',
				header: (
					<>
						Commercial Invoice <br /> Number
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'commercial_invoice_value',
				header: (
					<>
						Commercial Invoice <br /> Value
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'convention_rate',
				header: (
					<>
						Conversion
						<br /> Rate
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess?.includes('update') &&
					!haveAccess?.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={haveAccess?.includes('update')}
							showDelete={haveAccess?.includes('delete')}
						/>
					);
				},
			},
		],
		[data, haveAccess]
	);
};
export const ReportColumns = ({ data }) => {
	return useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'article_name',
				header: 'Article',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'category_name',
				header: 'Category',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// Opening
			{
				accessorKey: 'opening_quantity',
				header: 'Opening Stock',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'opening_quantity_rate_usd',
				header: (
					<>
						Unit Price
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'opening_quantity_total_price_usd',
				header: (
					<>
						Total Value
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			{
				accessorKey: 'opening_quantity_rate_bdt',
				header: (
					<>
						Unit Price
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'opening_quantity_total_price_bdt',
				header: (
					<>
						Total Value
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			// Received
			{
				accessorKey: 'purchased_quantity',
				header: 'Received QTY',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'purchased_quantity_rate_usd',
				header: (
					<>
						Unit Price
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'purchased_quantity_total_price_usd',
				header: (
					<>
						Total Value
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			{
				accessorKey: 'purchased_quantity_rate_bdt',
				header: (
					<>
						Unit Price
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'purchased_quantity_total_price_bdt',
				header: (
					<>
						Total Value
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			// Total Stock
			{
				accessorKey: 'sub_total_quantity',
				header: 'Total Stock QTY',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'sub_total_quantity_rate_usd',
				header: (
					<>
						Unit Price
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'sub_total_quantity_total_price_usd',
				header: (
					<>
						Total Stock Value
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			{
				accessorKey: 'sub_total_quantity_rate_bdt',
				header: (
					<>
						Unit Price
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'sub_total_quantity_total_price_bdt',
				header: (
					<>
						Total Stock Value
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			// Issued
			{
				accessorKey: 'consumption_quantity',
				header: 'Issued QTY',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'consumption_quantity_rate_usd',
				header: (
					<>
						Unit Price
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'consumption_quantity_total_price_usd',
				header: (
					<>
						Total Value
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			{
				accessorKey: 'consumption_quantity_rate_bdt',
				header: (
					<>
						Unit Price
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'consumption_quantity_total_price_bdt',
				header: (
					<>
						Total Value
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			// Closing
			{
				accessorKey: 'closing_quantity',
				header: 'Closing Stock',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'closing_quantity_rate_usd',
				header: (
					<>
						Unit Price
						<br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'closing_quantity_total_price_usd',
				header: (
					<>
						Total Closing
						<br />
						Stock Value(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
			{
				accessorKey: 'closing_quantity_rate_bdt',
				header: (
					<>
						Unit Price
						<br />
						(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(2)}
					</div>
				),
			},
			{
				accessorKey: 'closing_quantity_total_price_bdt',
				header: (
					<>
						Total Closing
						<br />
						Stock Value(BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>
						{info.getValue().toFixed(4)}
					</div>
				),
			},
		],
		[data]
	);
};
export const VendorReportColumns = ({ data }) => {
	return useMemo(
		() => [
			{
				accessorKey: 'vendor_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_price_usd',
				header: (
					<>
						Total Received <br />
						Amount (USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>{info.getValue()}</div>
				),
			},
			{
				accessorKey: 'total_price_bdt',
				header: (
					<>
						Total Received <br />
						Amount (BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<div className='text-right'>{info.getValue()}</div>
				),
			},
		],
		[data]
	);
};
