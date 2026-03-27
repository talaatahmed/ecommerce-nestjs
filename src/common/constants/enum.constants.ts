export enum SystemRoles {
  ADMIN = 'admin',
  USER = 'user',
}

export enum roles {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum genders {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// order status
export enum orderStatusEnum {
  PENDING = 'pending',
  PLACED = 'placed',
  PREPARING = 'preparing',
  ON_WAY = 'on_way',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum paymentMethodEnum {
  CASH = 'cash',
  CARD = 'card',
}
