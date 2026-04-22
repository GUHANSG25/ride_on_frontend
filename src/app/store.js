import { configureStore } from '@reduxjs/toolkit'
import routeReducer from '../features/route/slice/RouteSlice'
import operatorReducer from '../features/operator/slice/OperatorSlice'
import busReducer from '../features/Bus/Slice/BusSlice'
import tripReducer from '../features/trip/Slice/TripSlice'
import profileReducer from '../features/profile/slice/ProfileSlice'
import bookingReducer from '../features/booking/Slice/BookingSlice'

const store = configureStore({
    reducer: {
        route: routeReducer,
        operator: operatorReducer,
        bus: busReducer,
        trip: tripReducer,
        profile: profileReducer,
        booking: bookingReducer,
    }
})

export default store;