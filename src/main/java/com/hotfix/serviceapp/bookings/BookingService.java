package com.hotfix.serviceapp.bookings;

import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.jobs.JobRepository;
import com.hotfix.serviceapp.jobs.JobStatus;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final JobRepository jobRepository;

    public BookingService(BookingRepository bookingRepository, JobRepository jobRepository) {
        this.bookingRepository = bookingRepository;
        this.jobRepository = jobRepository;
    }

    public Booking proposeBooking(CreateBookingRequestDto request, Integer tradesmanId) {

        Job job = jobRepository.findById(request.jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getSelectedTradesman().getId().equals(tradesmanId)) {
            throw new RuntimeException("Not assigned to this job");
        }

        if (job.getBooking() != null) {
            throw new RuntimeException("Booking already exists");
        }

        Booking booking = new Booking();
        booking.setJob(job);
        booking.setTradesman(job.getSelectedTradesman());
        booking.setStartTime(request.startTime);
        booking.setEndTime(request.endTime);
        booking.setStatus(BookingStatus.PROPOSED);

        job.setStatus(JobStatus.SCHEDULED);

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Integer bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);

        if (status == BookingStatus.COMPLETED) {
            booking.getJob().setStatus(JobStatus.COMPLETED);
        }

        return bookingRepository.save(booking);
    }

}
