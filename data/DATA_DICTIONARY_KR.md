# ECU 수리 데이터 표준

| 컬럼 | 의미 | 공개여부 |
|---|---|---|
| case_id | 사례 ID | 공개 가능 |
| date | 수리일 | 월 단위 권장 |
| manufacturer | 제조사 | 공개 가능 |
| vehicle_model | 차종 | 공개 가능 |
| model_year | 연식 | 공개 가능 |
| engine | 엔진 | 공개 가능 |
| fuel | 연료 | 공개 가능 |
| mileage_km | 주행거리 | 구간화 권장 |
| ecu_category | ECU 계통 | 공개 가능 |
| ecu_name | ECU명 | 공개 가능 |
| ecu_part_no | ECU Part No | 공개 여부 확인 |
| ecu_hw_no | HW 번호 | 공개 여부 확인 |
| ecu_sw_no | SW 번호 | 공개 여부 확인 |
| dtc | DTC | 공개 가능 |
| symptom | 증상 | 공개 가능 |
| can_error | CAN 오류 | 공개 가능 |
| power_ground_check | 전원/접지 결과 | 공개 가능 |
| root_cause | 원인 | 핵심 전문성 |
| repair_method | 수리 방법 | 핵심 전문성 |
| replaced_parts | 교체 부품 | 공개 가능 |
| repair_time_min | 처리시간 | 집계 공개 |
| success | 성공여부 | 집계 공개 |
| recurred | 재발여부 | 집계 공개 |
| notes | 기술 메모 | 공개 전 검토 |
| source | 데이터 출처 | 내부관리 |

## 추가 권장 컬럼

- symptom_group
- dtc_family
- communication_protocol
- can_bitrate
- ecu_supplier
- board_revision
- failure_component
- repair_level
- test_bench_result
- before_after_measurement
- waveform_reference
- software_version
- calibration_version
- diagnostic_tool
