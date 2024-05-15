import { Router } from "express";
import createBooking from "../services/bookings/createBooking.js";
import deleteBooking from "../services/bookings/deleteBooking.js";
import getBookings from "../services/bookings/getBookings.js";
import getBookingById from "../services/bookings/getBookingById.js";
import updateBookingById from "../services/bookings/updateBookingById.js";
//import /*authMiddleware*/from "../middleware/advancedAuth.js";

const bookingsRouter = Router();

bookingsRouter.post(
  "/",
  /*authMiddleware*/ async (req, res) => {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;
    const newBooking = await createBooking(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );
    res.status(201).json(newBooking);
  }
);

bookingsRouter.delete(
  "/:id",
  /*authMiddleware*/ async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBookingId = await deleteBooking(id);

      if (!deletedBookingId) {
        res.status(404).send(`Booking ${id} not found`);
      } else {
        res.status(200).json({
          message: `Booking with id ${deleteBooking} was deleted!`,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Deleting booking ${id} failed");
    }
  }
);

bookingsRouter.get("/", async (req, res) => {
  try {
    const bookings = await getBookings();
    //console.log("bookings", bookings);
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting bookings");
  }
});

bookingsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).send(`Booking ${id} not found`);
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).send("Error fetching booking by ID");
  }
});

bookingsRouter.put(
  "/:id",
  /*authMiddleware*/ async (req, res) => {
    try {
      const { id } = req.params;
      const {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      } = req.body;
      const updatedBooking = await updateBookingById(
        id,
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus
      );
      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error(error);
      res.status(500).send("Booking failed to update by Id");
    }
  }
);

export default bookingsRouter;
