export class ChatMessageResponse {
  id: number;
  chatId: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  content: string;
  timestamp: string;
  photos:string | undefined;
  status: string;

  constructor(
    id: number,
    chatId: string,
    senderId: string,
    recipientId: string,
    senderName: string,
    recipientName: string,
    content: string,
    timestamp: string,
    status: string
  ) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.senderName = senderName;
    this.recipientName = recipientName;
    this.content = content;
    this.timestamp = timestamp;
    this.status = status;
  }
}
