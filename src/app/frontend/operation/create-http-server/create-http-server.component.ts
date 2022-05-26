import { MatSnackBar } from '@angular/material/snack-bar';
import { yamlToJson, jsonToYaml } from './../../utils/index';
import { OperationService } from './../operation.service';
import { OperationHTTPServer } from './../../type/operation';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-http-server',
  templateUrl: './create-http-server.component.html',
  styleUrls: ['./create-http-server.component.scss'],
})
export class CreateHttpServerComponent implements OnInit {
  id!: string;
  isEdit: boolean = false;
  title: string = 'Create';
  addressForm = this.fb.group({
    name: ['', Validators.required],
    address: '',
    port: '',
    path: ['', Validators.required],
    scheme: ['', Validators.required],
    timeoutSeconds: '',
  });
  yamlForm = this.fb.group({
    yaml: '',
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private operationService: OperationService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.isEdit = true;
        this.title = 'Edit';
        this.getOperation();
        this.getRowOperation();
      }
    });
  }
  getOperation() {
    this.operationService.getOperation(this.id).subscribe(data => {
      this.addressForm.patchValue(data);
    });
  }
  getRowOperation() {
    this.operationService.getRowDiagnosis(this.id).subscribe(async params => {
      const yaml = await jsonToYaml(params);
      this.yamlForm.setValue({ yaml: yaml });
    });
  }

  onSubmit() {
    if (!this.addressForm.valid) return;
    const params = this.addressForm.value;
    if (this.isEdit) {
      this.operationService.edit(this.createK8sParams(params)).subscribe(() => {
        this._snackBar.open('Edit Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/operation']);
      });
    } else {
      this.operationService
        .create(this.createK8sParams(params))
        .subscribe(() => {
          this._snackBar.open('Create Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.router.navigate(['/operation']);
        });
    }
  }
  createK8sParams(params: OperationHTTPServer): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Operation',
      metadata: {
        name: params.name,
      },
      spec: {
        processor: {
          timeoutSeconds: params.timeoutSeconds || 30,
          httpServer: {
            address: params.address || '0.0.0.0',
            scheme: params.scheme,
            port: params.port || 8090,
            path: params.path,
          },
        },
      },
    };

    return result;
  }
  async submitByYaml() {
    if (!this.yamlForm.valid) return;
    const req = await yamlToJson(this.yamlForm.value.yaml);
    if (this.isEdit) {
      this.operationService.edit(req).subscribe(() => {
        this._snackBar.open('Edit Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/operation']);
      });
    } else {
      this.operationService.create(req).subscribe(() => {
        this._snackBar.open('Create Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/operation']);
      });
    }
  }
  cancel() {
    this.router.navigate(['/operation']);
  }
}
