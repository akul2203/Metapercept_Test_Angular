import { Component, OnInit } from '@angular/core';
import { Doctor } from 'src/app/entity/Doctor';
import { DoctorReview } from 'src/app/entity/DoctorReview';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';
import { DoctorReviewService } from 'src/app/services/doctor-service/doctor-review.service';

@Component({
  selector: 'app-doctor-review-rating',
  templateUrl: './doctor-review-rating.component.html',
  styleUrls: ['./doctor-review-rating.component.css']
})
export class DoctorReviewRatingComponent implements OnInit {

  reviews: DoctorReview[] = [];
  replyText: string = '';
  doctorId:any;
  doctor: Doctor = new Doctor;
  doctorReviewReplyRequest: DoctorReviewReplyRequest = new DoctorReviewReplyRequest;
  constructor(private doctorreviewservice: DoctorReviewService,private scheduleservice:DoctorScheduleService) { }
  ngOnInit(): void {

    var userString = localStorage.getItem('user');

    if (userString) {
      var user = JSON.parse(userString);
      // console.log(user.email + user.id);
      if (user.id) {
        this.scheduleservice.getdoctorbyuserid(user.id).subscribe((data: any) => {
          this.doctorId = data.doctor.id;
          this.doctor = data.doctor;
          console.log("->>>>>>>>>" + this.doctorId);
          this.doctorreviewservice.getReviewByDoctorId(data.doctor.id).subscribe((data: any) => {
            this.reviews = data.ratings;
          })
        });
      }
    }
  }


  replyToReview(reviewid: any) {
    console.log(reviewid);
    console.log(this.replyText);
    this.doctorReviewReplyRequest.doctorId =this.doctor.id;
    this.doctorReviewReplyRequest.description=this.replyText;
    this.doctorReviewReplyRequest.reviewRatingId=reviewid;
    this.doctorreviewservice.addReply(this.doctorReviewReplyRequest).subscribe((data:any)=>{

      alert("Success")
    })
  }



  // submitReply(review: DoctorReview) {
  //   console.log(review);
  //   const newReply = {
  //     rating: this.selectedRating, // Assuming you have a selectedRating property for the reply rating
  //     patientId: this.pid,
  //     description: review.replyContent,
  //     reviewRatingId: review.id, // Assuming review.id corresponds to the ID of the review being replied to
  //     patientName: this.pName,
  //     imageName: this.pImage
  //   };
  //   this.doctorreviewservice.addReply(newReply).subscribe(
  //     (response: any) => {
  //       console.log('Reply submitted successfully:', response);
  //       review.replyContent = '';
  //       review.showReplyForm = false; // Hide the reply form
  //       let obj: DoctorReview = this.doctorreview.find(obj => obj.id == response.message.reviewRatingId) as DoctorReview
  //       obj.replyResponse.push(response.message)
  //       console.log('----', obj);
  //     },
  //     (error) => {
  //       console.error('Error submitting reply:', error);
  //     }
  //   );
  // }
}

export class DoctorReviewReplyRequest {
  replyId!: number;
  patientId!: number;
  doctorId!: number;
  description!: string;
  reviewRatingId!: number;
}
