import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
 import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-question-engine',
  templateUrl: './question-engine.component.html',
  styleUrls: ['./question-engine.component.scss']
})
export class QuestionEngineComponent implements OnInit {
  questionForm: FormGroup;
  questions: any[] = [];
  authToken: string;
  decodeData: any;
  optionsDataArray: string[] = [];  // Initialize with one empty string
  optionsData: string;
  selectedType: string = 'Select';
  questionTypes = ['Yes/No', 'Type-Answer', 'Dropdown', 'Other'];
  questionData = {
    iOrganizationId: '',
    sTitle: '',
    sDescription: '',
    sType: '',
    sOptions: []
  };
  newOption: any;
  loading: boolean;
  addQuestion: boolean = false;
  constructor(private fb: FormBuilder, private questionService: ApiService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    this.authToken = localStorage.getItem('token');
    // console.log(this.authToken);
    this.decodeData = jwtDecode(this.authToken as string)
    console.log(this.decodeData.iOrganizationId);


    this.loadQuestions();
  }

  openAddQuestion(){
    this.addQuestion=true;
  }

  onQuestionTypeChange() {
    // Clear options if the question type is changed
    if (this.selectedType !== 'Dropdown') {
      this.optionsDataArray = [];
    }
  }

  addOption() {
    // Ensure the new option is not empty
    if (this.newOption.trim()) {
      this.optionsDataArray.push(this.newOption.trim());
      this.newOption = ''; // Clear input after adding
    }
  }

  removeOption(index: number) {
    this.optionsDataArray.splice(index, 1); // Remove option from the array
  }

  loadQuestions() {
    this.questionService.getQuestions(this.decodeData.iOrganizationId).subscribe((data) => {
      console.log(data)
      this.questions = data.body.data;
      this.questions.sort((a, b) => new Date(b.dCreatedDate).getTime() - new Date(a.dCreatedDate).getTime());

    });
  }

  onSubmit() {
    this.questionData.iOrganizationId = this.decodeData.iOrganizationId;
    this.questionData.sType = this.selectedType;
    this.questionData.sOptions = this.optionsDataArray;

    console.log(this.questionData)
    this.questionService.saveQuestion(this.questionData).subscribe(() => {
      this.loadQuestions();  // Refresh questions list after submission
      this.questionData = {
        iOrganizationId: '',
        sTitle: '',
        sDescription: '',
        sType: '',
        sOptions: []
      };

      Swal.fire({
        title: 'New Question Added in List',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);

      this.addQuestion=false;
      this.optionsDataArray = [];
    });
  }
}
