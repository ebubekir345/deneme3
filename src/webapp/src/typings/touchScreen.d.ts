interface BoxItemsInterface {
  key: number;
  title: string;
  selected: boolean;
  volume?: string;
  content: any;
  containedItemsType?: string;
  packageId?: string;
  cargoPackageIndex?: number;
  type?: PackageType;
}

interface OrderItemsInterface {
  productId: string;
  productName: string;
  sku: string;
  barcodes?: string[];
  imageUrl: string;
  amountInOrder: number;
  boxedCount: number;
  isMissingItem?: boolean;
  damagedBoxedCount?: number;
  controlBoxedCount?: number;
  returnState?: any;
  type?: string;
  serialNumbers?: string[];
  productTags?: HOVProductTagsOutputDTO;
  isTrackSerialNumber?: boolean;
  isCreatedWithSerialNumber?: boolean;
  isTrackSimpleSerialNumber?: boolean;
  scannedCount?: number;
  unboxedAmount?: number;
}

interface VasItemInterface {
  barcode: string;
  vasType: string;
  amountInOrder: number;
  boxedCount: number;
  info?: string;
}

interface MissingItemsInterface {
  productId: string;
  productName: string;
  sku: string;
  barcodes?: string[];
  imageUrl: string;
  amountInOrder: number;
  boxedCount: number;
  isMissingItem: boolean;
}

interface CoOpInterface {
  id?: string;
  fullName?: string;
}

interface SearchQueryInterface {
  customerName: string;
  recipientName: string;
  referenceNumber: string;
  cargoPackageLabel: string;
  barcodes: string[];
  operationId: string;
  displayAll: boolean;
  serialNumber: string;
}

interface ProductInterface {
  barcodes: string;
  isSerialNumberTrackRequiredProduct: boolean;
  isSimpleSerialNumberTrackRequiredProduct: boolean;
  productImageURL: string;
  productName: string;
  sku: string;
  operationId?: string;
  totePickingItemsSerialNumbers?: string[];
  count?: number;
}

interface InfoPopupInterface {
  isOpen: boolean;
  header: string | JsxElement;
  subHeader?: string | JsxElement;
  icon?: string | JsxElement;
}

interface SlotInterface {
  toteName: string;
  isSelectable?: boolean;
  isSelected: boolean;
  toteContent: ToteContainedItemOutputDTO[];
}
