package com.hotfix.serviceapp.bookings;

import java.time.LocalDateTime;

public class CreateBookingRequestDto {
    public Integer jobId;
    public LocalDateTime startTime;
    public LocalDateTime endTime;
}
