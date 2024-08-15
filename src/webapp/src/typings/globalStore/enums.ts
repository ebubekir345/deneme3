export enum SlamStationModals {
  Logout = 'Logout',
}

export enum ProblemSolverModals {
  Logout = 'Logout',
}

export enum WaitingStatusFilter {
  Total = 'Total',
  WaitingToProcess = 'WaitingToProcess',
  InProcess = 'InProcess',
  Cancelled = 'Cancelled',
}

export enum ReadyToShipStatusFilter {
  Total = 'Total',
  ShipmentFailure = 'ShipmentFailure',
  Cancelled = 'Cancelled',
}

export enum actionBarcodes {
  Enter = 'ENTER',
  PackageNote = 'Paketleme Notu',
}

export enum MissingItemTransferModals {
  Logout = 'Logout',
  OrderStatus = 'OrderStatus',
  CompleteMissingItemTransfer = 'CompleteMissingItemTransfer',
  MissingItem = 'MissingItem',
  SerialNumber = 'SerialNumber',
}

export enum InventoryItemTypeForQueries {
  OutboundItem = 'OutboundItem',
  ReceivedItem = 'ReceivedItem',
  StockItem = 'StockItem',
  CellAllocatedItem = 'CellAllocatedItem',
  PickingItem = 'PickingItem',
  PackingItem = 'PackingItem',
  DamagedItem = 'DamagedItem',
  LostItem = 'LostItem',
  FoundItem = 'FoundItem',
  RestowItem = 'RestowItem',
  ReservedItem = 'ReservedItem'
}
