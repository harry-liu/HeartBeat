import { MetricsSource } from './../../types/metricsSource';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ReportResponse } from '../../types/reportResponse';
import { metrics } from '../../utils/config';
import { ReportParams } from '../../models/reportParams';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ExportComponent implements OnInit, OnChanges {
  @Input() params: ReportParams;
  @Input() metricsSource: MetricsSource;

  loading: boolean;
  reportResponse: ReportResponse;
  includeBoardData: boolean;
  includePipelineData: boolean;
  csvTimeStamp: number;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  ngOnChanges({ params }: SimpleChanges): void {
    this.reportResponse = null;
    if (params && params.currentValue) {
      this.csvTimeStamp = new Date().getTime();
      this.fetchReports();

      const boardConfig = metrics.filter((metric) => metric.roles.includes('board')).map((metric) => metric.name);
      const pipelineConfig = metrics
        .filter((metric) => metric.roles.includes('pipelineTool'))
        .map((metric) => metric.name);
      this.includeBoardData = boardConfig.filter((c) => this.params.metrics.includes(c)).length > 0;
      this.includePipelineData = pipelineConfig.filter((c) => this.params.metrics.includes(c)).length > 0;
    }
  }

  fetchReports() {
    this.loading = true;
    this.apiService.generateReporter({ ...this.params, csvTimeStamp: this.csvTimeStamp }).subscribe(
      (res) => {
        this.loading = false;
        this.reportResponse = res;
      },
      () => {
        this.loading = false;
      }
    );
  }
}
