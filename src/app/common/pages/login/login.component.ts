import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/payload/Request/authRequest';
import { ForgetpasswordService } from 'src/app/services/user/forgetpassword.service';
import { LoginService } from 'src/app/services/user/login.service';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  status: any;
  constructor(private cookiesservice: CookieService, private snack: MatSnackBar, private login: LoginService, private router: Router, private forgetpassword: ForgetpasswordService, private fb: FormBuilder) { }

  loginform!: FormGroup;
  loginData: AuthRequest = new AuthRequest;
  rememberme: boolean = false;
  secretKey = 'UpcharDwar';
  temppass: string = '';
  ngOnInit(): void {
    this.getcookie();
    this.checkLoginFormValidation();
  }

  onRememberMeChange(event: any) {
    this.rememberme = event.target.checked;
  }

  encryptData(data: string, secretKey: string): string {
    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encryptedData;
  }

  decryptData(encryptedData: string, secretKey: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }


    checkLoginFormValidation() {
      this.loginform = this.fb.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
      })
    }

  getCookiedata(name: string) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  getcookie() {
    const email = this.getCookiedata('email');
    const pass = this.getCookiedata('password');
    if (pass !== null) {
      this.temppass = pass; // Assuming temppass is of type string
    } else {
      // Handle the case where pass is null, e.g., set a default value
      this.temppass = 'defaultPassword';
    }
    const password = this.decryptData(this.temppass, this.secretKey);
    if (email !== null || password !== null) {
      this.loginData.email = email as string;
      this.loginData.password = password as string;
    }
    console.log('Email from cookie:', email);
    console.log('Password from cookie:', password);
  }

  setCookiedata(name: string, value: string, days: number): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=http://localhost/login`;
  }

  setCookie() {
    console.log("cookie button submitted");
    const email = this.loginData.email;
    const pass = this.encryptData(this.loginData.password, this.secretKey);
    this.setCookiedata('email', email, 7);
    this.setCookiedata('password', pass, 7);
  }

  async formSubmit() {
    console.log(this.loginData.email);
    console.log(this.loginData.password);
    console.log("login button submitted");
    localStorage.clear()
    this.loginform.markAllAsTouched();
    if (!this.loginform.valid) {
      return;
    }
    //request to server to genrate token
    this.login.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log("success");
        console.log(data);
        if (this.rememberme) {
          this.setCookie();
        }

        //loginn....
        this.login.setLoginUser(data.token);
        this.getCurrentUser();
      },
      (error) => {
        console.log('Error !');
        console.log(error);
        this.snack.open("invalid details ,try again", '', {
          duration: 3000,
        });
      }
    )
    return;
  }

  getCurrentUser() {
    this.login.getCurrentUser().subscribe(
      (user: any) => {
        this.login.setUser(user);
        // set into observable
        this.login.getCurrentUser().subscribe((data) => {
          console.log(data);
        })
        this.status = user.status;
        console.log(user);
        // redirect if admin :adminDashboard

        //redirect if user : userDashBoard
        if (this.login.getUserRole().includes("ADMIN")) {
          //admin dashboard
          // window.location.href='/admin'
          this.router.navigate(['/admindashboard'])
          this.login.loginStatusSubject.next(true);
        }
        else if (this.login.getUserRole().includes("DOCTOR") && this.status === "verified") {
          //user dashboard
          this.router.navigate(['/doctordashboard'])
          this.login.loginStatusSubject.next(true);
        }
        else if (this.login.getUserRole().includes("DOCTOR") && this.status === "not varified") {
          //user dashboard
          this.router.navigate(['/doctorregistration'])
          this.login.loginStatusSubject.next(true);
        }
        else if (this.login.getUserRole().includes("LAB") && this.status === "not varified") {
          //user dashboard
          this.router.navigate(['/labregister'])
          this.login.loginStatusSubject.next(true);
        }

        else if (this.login.getUserRole().includes("LAB") && this.status === "verified") {
          //user dashboard
          this.router.navigate(['/labdashboard/labdatadashboard'])
          this.login.loginStatusSubject.next(true);
        }
        else if (this.login.getUserRole().includes("PATIENT") && this.status === "verified") {
          //user dashboard
          this.router.navigate(["/patientmaindashboard/patientdashboard"])
          this.login.loginStatusSubject.next(true);
        }
        else if (this.login.getUserRole().includes("PATIENT") && this.status === "not varified") {
          //user dashboard
          this.router.navigate(["/patientregister"])
          this.login.loginStatusSubject.next(true);
        }
        else {
          this.login.logout();
        }

      }
    );
  }
}
