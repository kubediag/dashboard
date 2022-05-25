import { DiagnosisItem } from './../../type/diagnosis';
import { DiagnosisService } from './../diagnosis.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jsonToYaml, yamlToJson } from './../../utils/index';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  defaultParam = this.fb.group({ key: '', value: '' });
  parameters = this.fb.array([this.defaultParam]);
  addressForm = this.fb.group({
    name: ['', Validators.required],
    namespace: ['', Validators.required],
    operationSet: ['', Validators.required],
    node: '',
    podName: '',
    podNamespace: '',
    parameters: this.parameters,
  });
  yamlForm = this.fb.group({
    yaml: ['', Validators.required],
  });
  hasUnitNumber = false;
  title: string = 'Create Diagnosis';

  operationSetList: string[] = [];
  namespaceList: string[] = [];
  nodeNameList: string[] = [];
  podNameList: string[] = [];
  id!: string;
  isEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private diagnosisService: DiagnosisService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.isEdit = true;
        this.title = 'Edit Diagnosis';
        this.getDiagnosis();
        this.getRowDiagnosis();
      }
    });
    this.getNamespaceList();
    this.getOperationSetList();
    this.getNodeList();
    this.getPodList();
  }

  getNamespaceList() {
    this.diagnosisService.getNamespaceList().subscribe(data => {
      this.namespaceList = data;
    });
  }
  getOperationSetList() {
    this.diagnosisService.getOperationSet().subscribe(data => {
      this.operationSetList = data;
    });
  }
  getNodeList() {
    this.diagnosisService.getNodeList().subscribe(data => {
      this.nodeNameList = data;
    });
  }
  getPodList() {
    this.diagnosisService
      .getPodList(this.addressForm.value.podNamespace)
      .subscribe(data => {
        this.podNameList = data;
      });
  }
  onNamespaceChange() {
    this.addressForm.patchValue({
      podName: '',
    });
    this.getPodList();
  }

  getDiagnosis() {
    this.diagnosisService.getDiagnosis(this.id).subscribe(params => {
      this.addressForm.patchValue(params);
      // patchValue can not change array length
      params.parameters?.forEach((item, i) => {
        if (!i) {
          this.parameters.removeAt(0);
        }
        this.parameters.push(this.fb.group(item));
      });
    });
  }
  getRowDiagnosis() {
    this.diagnosisService.getRowDiagnosis(this.id).subscribe(async params => {
      const yaml = await jsonToYaml(params);
      this.yamlForm.setValue({ yaml: yaml });
    });
  }
  addData() {
    const defaultParam = this.fb.group({ key: null, value: null });
    this.parameters.push(defaultParam);
  }
  deleteDate(i: number) {
    this.parameters.removeAt(i);
  }

  onSubmit() {
    if (!this.addressForm.valid) return;
    const params = this.addressForm.value;
    if (this.isEdit) {
      this.diagnosisService.edit(this.createK8sParams(params)).subscribe(() => {
        this._snackBar.open('Edit Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/diagnosis']);
      });
    } else {
      this.diagnosisService
        .create(this.createK8sParams(params))
        .subscribe(() => {
          this._snackBar.open('Create Success !', 'done', {
            duration: 1000,
            verticalPosition: 'top',
          });
          this.router.navigate(['/diagnosis']);
        });
    }
  }

  editK8sParams(params: DiagnosisItem) {
    const rowData = this.diagnosisService.rowList[+this.id];
    delete rowData.metadata.resourceVersion;
    rowData.metadata.name = params.name;
    rowData.metadata.namespace = params.namespace || 'default';
    (rowData.spec.nodeName = params.node),
      (rowData.spec.operationSet = params.operationSet),
      (rowData.spec.podReference.name = params.podName),
      (rowData.spec.podReference.namespace = params.podNamespace);
    if (params.parameters) {
      params.parameters.forEach(item => {
        rowData.spec.parameters[item.key] = item.value;
      });
    }
    return rowData;
  }

  createK8sParams(params: DiagnosisItem): object {
    const result: Record<string, any> = {
      apiVersion: 'diagnosis.kubediag.org/v1',
      kind: 'Diagnosis',
      metadata: {
        name: params.name,
        namespace: params.namespace || 'default',
      },
      spec: {
        nodeName: params.node,
        operationSet: params.operationSet,
        parameters: {},
        podReference: {
          name: params.podName,
          namespace: params.podNamespace,
        },
      },
    };
    if (params.parameters) {
      params.parameters.forEach(item => {
        if (item.key) {
          result['spec'].parameters[item.key] = item.value;
        }
      });
    }
    return result;
  }

  async submitByYaml() {
    if (!this.yamlForm.valid) return;
    const req = await yamlToJson(this.yamlForm.value.yaml);
    if (this.isEdit) {
      this.diagnosisService.edit(req).subscribe(() => {
        this._snackBar.open('Edit Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/diagnosis']);
      });
    } else {
      this.diagnosisService.create(req).subscribe(() => {
        this._snackBar.open('Create Success !', 'done', {
          duration: 1000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/diagnosis']);
      });
    }
  }
  cancel() {
    this.router.navigate(['/diagnosis']);
  }
}
