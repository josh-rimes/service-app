package com.hotfix.serviceapp.bookings;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking proposeBooking(@RequestBody CreateBookingRequestDto request,
                                  @RequestParam Integer tradesmanId) {
        return bookingService.proposeBooking(request, tradesmanId);
    }

    @PatchMapping("/{bookingId}")
    public Booking updateBookingStatus(@PathVariable Integer bookingId, @RequestBody UpdateBookingStatusRequestDto request) {
        return bookingService.updateBookingStatus(bookingId, request.status);
    }
}
