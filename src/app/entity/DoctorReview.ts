import { DoctorReviewReplayResponse } from "./DoctorReviewReplyResponse";

export class DoctorReview {
  id: number = 0;

  rating: number = 0;
  labId: number = 0;
  patientId: number = 0;
  description: string = '';
  doctorId:number =0;
  patientName: string = '';

  imageName: string = '';
  replyResponse: DoctorReviewReplayResponse[] = []

  replyContent: string = ''; // For storing the reply content
  showReplyForm: boolean = false;
}
