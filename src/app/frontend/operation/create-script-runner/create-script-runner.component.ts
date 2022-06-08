/**
 * Copyright 2022 The KubeDiag Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MatSnackBar } from '@angular/material/snack-bar';
import { yamlToJson, jsonToYaml } from './../../utils/index';
import { OperationService } from './../operation.service';
import { OperationScriptRunner } from './../../type/operation';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-script-runner',
  templateUrl: './create-script-runner.component.html',
  styleUrls: ['./create-script-runner.component.scss'],
})
export class CreateScriptRunnerComponent implements OnInit {
  id!: string;
  isEdit: boolean = false;
  title: string = 'Create';
  addressForm = this.fb.group({
    name: ['', Validators.required],
    script: '',
    timeoutSeconds: '',
    operationResultKey: '',
    argKeys: this.fb.array([this.fb.control('')]),
  });
  yamlForm = this.fb.group({
    yaml: '',
  });
  get argKeys() {
    return this.addressForm.get('argKeys') as FormArray;
  }
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
      (data as OperationScriptRunner).argKeys?.forEach((item, i) => {
        if (!i) {
          this.argKeys.removeAt(0);
        }
        this.argKeys.push(this.fb.control(item));
      });
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
      this.operationService
        .edit(this.createScriptRunnerParams(params))
        .subscribe(() => {
          this._snackBar.open('Edit Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.router.navigate(['/operation']);
        });
    } else {
      this.operationService
        .create(this.createScriptRunnerParams(params))
        .subscribe(() => {
          this._snackBar.open('Create Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.router.navigate(['/operation']);
        });
    }
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
  addData(): void {
    this.argKeys.push(this.fb.control(''));
  }
  deleteDate(i: number) {
    this.argKeys.removeAt(i);
  }
  createScriptRunnerParams(params: OperationScriptRunner): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Operation',
      metadata: {
        name: params.name,
      },
      spec: {
        processor: {
          timeoutSeconds: params.timeoutSeconds || 30,
          scriptRunner: {
            operationResultKey: params.operationResultKey,
            script: params.script,
            argKeys: params.argKeys,
          },
        },
      },
    };
    return result;
  }
}
