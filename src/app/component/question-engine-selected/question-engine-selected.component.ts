import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-question-engine-selected',
  templateUrl: './question-engine-selected.component.html',
  styleUrls: ['./question-engine-selected.component.scss']
})
export class QuestionEngineSelectedComponent implements OnInit {
  loading: boolean;
  validTypes = ['Yes/No', 'Type-Answer', 'Dropdown', 'Other']; // Dropdown options
  questionForm: FormGroup;
  questionId: string;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private questionService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionId = this.route.snapshot.paramMap.get('id');
    this.loadQuestion();
    this.questionForm = this.fb.group({
      sTitle: [''],
      sDescription: [''],
      sType: [''],
      sOptions: [''],
    });
  }

  loadQuestion() {
    this.questionService.getQuestionById(this.questionId).subscribe((response: any) => {
      const questionData = response.body.data; // Accessing the data property
      this.questionForm.patchValue({
        sTitle: questionData.title,
        sDescription: questionData.description,
        sType: questionData.type,
        sOptions: questionData.options || [], // Set empty array if no options
      });
      this.isLoading = false;
    });
  }

  onSubmit() {
    const formData = this.questionForm.value;
    // If the question type is Dropdown, ensure options are a valid array
    if (formData.sType === 'Dropdown' && typeof formData.sOptions === 'string') {
      formData.sOptions = formData.sOptions.split(',').map(option => option.trim());
    }
    this.questionService.updateQuestion(this.questionId, formData).subscribe((res: any) => {
      Swal.fire({
        title: "Question Updated Successfully!",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
      this.router.navigate(['/question-engine']); 
    });
  }

  onDelete() {
    Swal.fire({
      title: "Are you sure you want to delete this question?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      // denyButtonText: `Don't delete`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.questionService.deleteQuestion(this.questionId).subscribe(() => {
          Swal.fire("Deleted!", "", "success");
          this.router.navigate(['/question-engine']); 
        });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
}
