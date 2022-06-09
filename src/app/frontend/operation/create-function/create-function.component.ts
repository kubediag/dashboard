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
import { OperationFunction, CodeSourceItem } from './../../type/operation';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-function',
  templateUrl: './create-function.component.html',
  styleUrls: ['./create-function.component.scss'],
})
export class CreateFunctionComponent implements OnInit {
  id!: string;
  isEdit: boolean = false;
  title: string = 'Create';
  currentCodeSourceIndex: number = 0;
  addressForm = this.fb.group({
    name: ['', Validators.required],
    runtime: '',
    timeoutSeconds: '',
    codeSource: this.fb.array([
      this.fb.group({
        key: 'function.py',
        value: `def handler(context):
          result = dict()
          for key in context:
              result[key] = context[key]
          result["a"] = "1"
          result["b"] = "2"

          return result`,
      }),
    ]),
  });
  get codeSource() {
    return this.addressForm.get('codeSource') as FormArray;
  }
  yamlForm = this.fb.group({
    yaml: '',
  });
  runtimeList: string[] = ['Python3'];
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
      if (data.type === 'Function') {
        data.codeSource?.forEach((item, i) => {
          if (!i) {
            this.codeSource.removeAt(0);
          }
          this.codeSource.push(this.fb.group(item));
        });
      }
    });
  }
  getRowOperation() {
    this.operationService.getRowDiagnosis(this.id).subscribe(async params => {
      const yaml = await jsonToYaml(params);
      this.yamlForm.setValue({ yaml: yaml });
    });
  }
  changeCurrentCodeSourceIndex(i: number) {
    this.currentCodeSourceIndex = i;
  }

  onSubmit() {
    if (!this.addressForm.valid) return;
    const params = this.addressForm.value;
    params.codeSource = {};
    this.codeSource.value.forEach((item: CodeSourceItem) => {
      params.codeSource[item.key] = item.value;
    });
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
  createScriptRunnerParams(params: OperationFunction): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Operation',
      metadata: {
        name: params.name,
      },
      spec: {
        processor: {
          timeoutSeconds: params.timeoutSeconds || 30,
          function: {
            runtime: params.runtime,
            codeSource: params.codeSource,
          },
        },
      },
    };
    return result;
  }
}
