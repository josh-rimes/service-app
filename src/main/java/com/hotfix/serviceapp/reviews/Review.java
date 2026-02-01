package com.hotfix.serviceapp.reviews;

import com.hotfix.serviceapp.jobs.Job;
import com.hotfix.serviceapp.users.User;
import jakarta.persistence.*;

@Entity
@Table(
        name = "reviews",
        uniqueConstraints = @UniqueConstraint(columnNames = {"job_id"})
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    private Job job;

    @ManyToOne
    private User customer;

    @ManyToOne
    private User tradesman;

    private int rating;

    private String comment;


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

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public User getTradesman() {
        return tradesman;
    }

    public void setTradesman(User tradesman) {
        this.tradesman = tradesman;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
