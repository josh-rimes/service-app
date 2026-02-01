package com.hotfix.serviceapp.bookings;

import com.hotfix.serviceapp.users.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking proposeBooking(@RequestBody CreateBookingRequestDto request) {

        User tradesman = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return bookingService.proposeBooking(request, tradesman);
    }

    @PatchMapping("/{bookingId}")
    public Booking updateBookingStatus(@PathVariable Integer bookingId, @RequestBody UpdateBookingStatusRequestDto request) {
        return bookingService.updateBookingStatus(bookingId, request.status);
    }
}
