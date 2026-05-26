export interface Property {
  code: string
  name: string
  property_type: string

  bedroom_quantity: number
  bathroom_quantity: number
  guest_capacity: number

  address: {
    street: string
    number: string
    complement?: string | null
    neighborhood: string
    city: string
    state: string
    postal_code: string
  }

  operational: {
    wifi_network: string
    wifi_password: string

    is_self_checkin: boolean

    property_access_type: string
    property_access_instructions: string
    property_password?: string

    has_parking_spot: boolean

    parking_spot_identifier?: string
    parking_spot_instructions?: string
  }

  rules: {
    check_in_time: string
    check_out_time: string

    allow_pet: boolean
    smoking_permitted: boolean
    suitable_for_children: boolean
    suitable_for_babies: boolean
    events_permitted: boolean
  }

  amenities: Record<string, boolean>

  images: string[]

  host: {
    name: string
    phone: string
  }
}