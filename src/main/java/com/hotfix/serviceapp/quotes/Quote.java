package com.hotfix.serviceapp.quotes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.jobs.JobStatus;
import com.hotfix.serviceapp.users.User;
import jakarta.persistence.*;

@Entity
@Table(
        name = "quotes",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"job_id", "tradesman_id"}
        )
)
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id")
    @JsonBackReference
    private Job job;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tradesman_id")
    private User tradesman;

    private Double priceEstimate;

    private String message;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getTradesman() {
        return tradesman;
    }

    public void setTradesman(User tradesman) {
        this.tradesman = tradesman;
    }

    public Double getPriceEstimate() {
        return priceEstimate;
    }

    public void setPriceEstimate(Double priceEstimate) {
        this.priceEstimate = priceEstimate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public QuoteStatus getStatus() {
        return status;
    }

    public void setStatus(QuoteStatus status) {
        this.status = status;
    }
}
