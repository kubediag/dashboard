import { yamlToJson, jsonToYaml } from './../../utils/index';
import { TriggerItem, TriggerPromethuesAlert } from './../../type/trigger';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TriggerService } from './../trigger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-prometheus-rule',
  templateUrl: './create-prometheus-rule.component.html',
  styleUrls: ['./create-prometheus-rule.component.scss'],
})
export class CreatePrometheusRuleComponent implements OnInit {
  id!: string;
  isEdit: boolean = false;
  title: string = 'Create';
  operationSetList: string[] = [];
  addressForm = this.fb.group({
    name: ['', Validators.required],
    operationSet: ['', Validators.required],
    nodeName: ['', Validators.required],
    alertName: '',
    labels: this.fb.array([this.fb.group({ key: '', value: '' })]),
    annotations: this.fb.array([this.fb.group({ key: '', value: '' })]),
  });
  get labels() {
    return this.addressForm.get('labels') as FormArray;
  }
  get annotations() {
    return this.addressForm.get('annotations') as FormArray;
  }
  yamlForm = this.fb.group({
    yaml: '',
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private triggerService: TriggerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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
    this.triggerService.getTrigger(this.id).subscribe((data: TriggerItem) => {
      this.addressForm.patchValue(data);
      (data as TriggerPromethuesAlert).labels?.forEach((item, i) => {
        if (!i) {
          this.labels.removeAt(0);
        }
        this.labels.push(this.fb.group(item));
      });
      (data as TriggerPromethuesAlert).annotations?.forEach((item, i) => {
        if (!i) {
          this.annotations.removeAt(0);
        }
        this.annotations.push(this.fb.group(item));
      });
    });
  }
  getRowtrigger() {
    this.triggerService.getRowTrigger(this.id).subscribe(async params => {
      const yaml = await jsonToYaml(params);
      this.yamlForm.setValue({ yaml: yaml });
    });
  }

  onSubmit() {
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
  createK8sParams(params: TriggerPromethuesAlert): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Trigger',
      metadata: {
        name: params.name,
      },
      spec: {
        operationSet: params.operationSet,
        sourceTemplate: {
          prometheusAlertTemplate: {
            regexp: {
              alertName: params.alertName,
              labels: {},
              annotations: {},
            },
          },
        },
      },
    };
    if (params.labels) {
      params.labels.forEach(item => {
        if (item.key) {
          result['spec'].sourceTemplate.prometheusAlertTemplate.regexp.labels[
            item.key
          ] = item.value;
        }
      });
    }
    if (params.annotations) {
      params.annotations.forEach(item => {
        if (item.key) {
          result[
            'spec'
          ].sourceTemplate.prometheusAlertTemplate.regexp.annotations[
            item.key
          ] = item.value;
        }
      });
    }
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
  addLabelsData(): void {
    const defaultParam = this.fb.group({ key: null, value: null });
    this.labels.push(defaultParam);
  }
  deleteLabelsDate(i: number) {
    this.labels.removeAt(i);
  }
  addAnnotationsData(): void {
    const defaultParam = this.fb.group({ key: null, value: null });
    this.annotations.push(defaultParam);
  }
  deleteAnnotationsDate(i: number) {
    this.annotations.removeAt(i);
  }
  cancel() {
    this.router.navigate(['/trigger']);
  }
}
