import driversService from './DriversService'
import usersServices from './UsersServices'
import carsServices from './CarsServices'
import pricingServices from './PricingService'
import paymentServices from './PaymentService'
import TicketsServices from './TicketsServices'
import appSettingServices from './AppSettingServices'
import ShipmentServices from './ShipmentService'
import StatesServices from './StatesServices'
import AboutAppServices from './AboutAppServices'

const services = {
    drivers: driversService,
    users: usersServices,
    cars: carsServices,
    price: pricingServices,
    payment: paymentServices,
    tickets: TicketsServices,
    appSetting: appSettingServices,
    shipments: ShipmentServices,
    states: StatesServices,
    aboutApp: AboutAppServices,
}

export const ServiceFactory = {
    get: name => services[name],
}
