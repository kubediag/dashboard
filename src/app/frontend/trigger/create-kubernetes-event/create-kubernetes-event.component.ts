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

import { TriggerItem, TriggerKubernetesEvent } from './../../type/trigger';
import { TriggerService } from './../trigger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { yamlToJson, jsonToYaml } from './../../utils/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-kubernetes-event',
  templateUrl: './create-kubernetes-event.component.html',
  styleUrls: ['./create-kubernetes-event.component.scss'],
})
export class CreateKubernetesEventComponent implements OnInit {
  addressForm = this.fb.group({
    name: ['', Validators.required],
    operationSet: ['', Validators.required],
    nodeName: ['', Validators.required],
    eventName: '',
    eventNamespace: '',
    reason: '',
    eventMessage: '',
  });
  yamlForm = this.fb.group({
    yaml: ['', Validators.required],
  });
  title: string = 'Create';
  operationSetList: string[] = [];
  nodeNameList: string[] = [];
  id!: string;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private triggerService: TriggerService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.isEdit = true;
        this.title = 'Edit';
        this.getTrigger();
        this.getRowtrigger();
      }
      this.getOperationSetList();
    });
  }
  getOperationSetList() {
    this.triggerService.getOperationSet().subscribe(data => {
      this.operationSetList = data;
    });
  }
  getTrigger() {
    this.triggerService.getTrigger(this.id).subscribe(params => {
      this.addressForm.patchValue(params);
    });
  }
  getRowtrigger() {
    this.triggerService.getRowTrigger(this.id).subscribe(async params => {
      const yaml = await jsonToYaml(params);
      this.yamlForm.setValue({ yaml: yaml });
    });
  }

  onSubmit(): void {
    if (!this.addressForm.valid) return;
    const params = this.addressForm.value;
    if (this.isEdit) {
      this.triggerService.edit(this.createK8sParams(params)).subscribe(() => {
        this._snackBar.open('Edit Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/trigger']);
      });
    } else {
      this.triggerService.create(this.createK8sParams(params)).subscribe(() => {
        this._snackBar.open('Create Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/trigger']);
      });
    }
  }

  createK8sParams(params: TriggerKubernetesEvent): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Trigger',
      metadata: {
        name: params.name,
      },
      spec: {
        operationSet: params.operationSet,
        sourceTemplate: {
          kubernetesEventTemplate: {
            regexp: {
              reason: params.reason,
              name: params.eventName,
              namespace: params.eventNamespace,
              message: params.eventMessage,
            },
          },
        },
      },
    };
    if (params.nodeName) {
      result['spec'].nodeName = params.nodeName;
    }

    return result;
  }

  async submitByYaml() {
    if (!this.yamlForm.valid) return;
    const req = await yamlToJson(this.yamlForm.value.yaml);
    if (this.isEdit) {
      this.triggerService.edit(req).subscribe(() => {
        this._snackBar.open('Edit Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/trigger']);
      });
    } else {
      this.triggerService.create(req).subscribe(() => {
        this._snackBar.open('Create Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/trigger']);
      });
    }
  }
  cancel() {
    this.router.navigate(['/trigger']);
  }
}
