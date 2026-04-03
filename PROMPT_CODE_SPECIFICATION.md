# 📋 PROMPT ĐẶC TẢ CẤU TRÚC CODE

## 🗂️ TREEMAP FOLDER

```
src/
├── app/(something)/     # Pages
│   └── [module-name]/
│       ├── page.tsx                  # List page
│       ├── type.ts                   # Types
│       ├── constant.ts               # Constants
│       ├── utils.ts                  # Utilities
│       ├── _sections/                # View components
│       │   ├── list/
│       │   │   ├── index.tsx
│       │   │   ├── table/
│       │   │   ├── toolbar/
│       │   │   └── modal/
│       │   └── hooks/
│       ├── components/               # Shared components trong module
│       ├── new/                      # Create page
│       │   ├── page.tsx
│       │   ├── _sections/
│       │   └── _components/
│       └── [id]/                     # Detail/Edit pages
│           ├── detail/
│           └── edit/
│
├── core/[domain]/                    # Business Logic
│   └── hooks/
│       ├── use-get-[entity]-list.ts     # Query list
│       ├── use-get-[entity]-detail.ts   # Query detail
│       ├── use-add-[entity].ts          # Mutation create
│       └── use-update-[entity].ts       # Mutation update
│
├── services/rest-api/app-api/        # API Layer
│   └── [service-name]/
│       ├── _service-instance.ts
│       └── [entity].ts
│
├── shared/                           # Shared Resources
│   ├── components/                   # UI components
│   ├── hooks/
│   └── utils/
│
├── constants/swr-keys.ts             # SWR cache keys
├── routes/paths.ts                   # Route definitions
└── layouts/                          # Layouts
```

---

## 🔄 LUỒNG DATA

```
Page → Section → Core Hook → Service API → Axios Instance → Backend
```

---

## 📝 CÁC BƯỚC TẠO MODULE MỚI

### BƯỚC 1: Tạo Service API

**File:** `src/services/rest-api/app-api/[service-name]/_service-instance.ts`
```typescript
import { createApiService } from '../../utils';
import { appApiIns } from '../api-instance';

export const [name]Service = createApiService(appApiIns, '/[api-prefix]/api');
```

**File:** `src/services/rest-api/app-api/[service-name]/[entity].ts`
```typescript
import { BaseJSONResponse, PaginationParams, ExtendingParams } from '../types';
import { [name]Service } from './_service-instance';

// 1. Define Types
export type T[Entity]Item = { _id: string; /* fields */ };
export type TFetch[Entity]Params = PaginationParams<ExtendingParams<{ keyword?: string; }>>;
export type TAdd[Entity]Body = Omit<T[Entity]Item, '_id'>;

// 2. Define API functions
const fetchList = (params: TFetch[Entity]Params) =>
  [name]Service.get<BaseJSONResponse<T[Entity]Item>>('/[endpoint]', { params });

const fetchDetail = (id: string) =>
  [name]Service.get<T[Entity]Item>(`/[endpoint]/${id}`);

const add = (body: TAdd[Entity]Body) =>
  [name]Service.post('/[endpoint]', body);

const update = ({ id, body }: { id: string; body: Partial<TAdd[Entity]Body> }) =>
  [name]Service.patch(`/[endpoint]/${id}`, body);

// 3. Export frozen object
export const [entity]Api = Object.freeze({ fetchList, fetchDetail, add, update });
```

---

### BƯỚC 2: Thêm SWR Keys

**File:** `src/constants/swr-keys.ts`
```typescript
export const FETCH_[ENTITY]_LIST = '/[module]/list';
export const FETCH_[ENTITY]_DETAIL = '/[module]/detail';
export const ADD_[ENTITY] = '/[module]/add';
export const UPDATE_[ENTITY] = '/[module]/update';
```

---

### BƯỚC 3: Tạo Core Hooks

**Query Hook (List):** `src/core/[domain]/hooks/use-get-[entity]-list.ts`
```typescript
import { ObjectKey, useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { FETCH_[ENTITY]_LIST } from 'src/constants/swr-keys';
import { TFetch[Entity]Params, [entity]Api } from 'src/services/rest-api/app-api/[service]/[entity]';

type TFetchingKey = ObjectKey<TFetch[Entity]Params>;
const fetcher = ({ key, ...params }: TFetchingKey) => [entity]Api.fetchList(params);

export const useGet[Entity]List = (params?: TFetch[Entity]Params) => {
  const { data, error, isLoading, mutate } = useAxiosSWR(
    { key: FETCH_[ENTITY]_LIST, ...params } as TFetchingKey,
    fetcher,
    { revalidateOnMount: true }
  );

  return { data, list: data?.data ?? [], error, isLoading, mutate };
};
```

**Query Hook (Detail):** `src/core/[domain]/hooks/use-get-[entity]-detail.ts`
```typescript
import { ObjectKey, useAxiosSWR } from 'src/shared/hooks/use-axios-swr';
import { FETCH_[ENTITY]_DETAIL } from 'src/constants/swr-keys';
import { [entity]Api } from 'src/services/rest-api/app-api/[service]/[entity]';

const fetcher = ({ key, id }: { key: string; id: string }) => [entity]Api.fetchDetail(id);

export const useGet[Entity]Detail = (id: string) => {
  const { data, isLoading, error, mutate } = useAxiosSWR(
    id ? { key: FETCH_[ENTITY]_DETAIL, id } : null,
    fetcher,
    { revalidateOnMount: true }
  );

  return { data, isLoading, error, mutate };
};
```

**Mutation Hook (Create):** `src/core/[domain]/hooks/use-add-[entity].ts`
```typescript
import { Key } from 'swr';
import useSWRMutation from 'swr/mutation';
import { ADD_[ENTITY] } from 'src/constants/swr-keys';
import { [entity]Api } from 'src/services/rest-api/app-api/[service]/[entity]';

type TArgs = Parameters<typeof [entity]Api.add>;
const mutator = (_key: Key, { arg }: { arg: TArgs }) => [entity]Api.add(...arg);

export const useAdd[Entity] = () => {
  const { trigger, isMutating } = useSWRMutation(ADD_[ENTITY], mutator);
  return { add: (...args: TArgs) => trigger(args), isAdding: isMutating };
};
```

**Mutation Hook (Update):** `src/core/[domain]/hooks/use-update-[entity].ts`
```typescript
import { Key } from 'swr';
import useSWRMutation from 'swr/mutation';
import { UPDATE_[ENTITY] } from 'src/constants/swr-keys';
import { [entity]Api } from 'src/services/rest-api/app-api/[service]/[entity]';

type TArgs = Parameters<typeof [entity]Api.update>;
const mutator = (_key: Key, { arg }: { arg: TArgs }) => [entity]Api.update(...arg);

export const useUpdate[Entity] = () => {
  const { trigger, isMutating } = useSWRMutation(UPDATE_[ENTITY], mutator);
  return { update: (...args: TArgs) => trigger(args), isUpdating: isMutating };
};
```

---

### BƯỚC 4: Thêm Routes

**File:** `src/routes/paths.ts`
```typescript
[module_name]: {
  root: '/[module-path]',
  new: '/[module-path]/new',
  detail: (id: string) => `/[module-path]/${id}/detail`,
  edit: (id: string) => `/[module-path]/${id}/edit`,
},
```

---

### BƯỚC 5: Tạo Page Structure

**List Page:** `src/app/(dashboard)/(management)/[module]/page.tsx`
```typescript
import { ListView } from './_sections/list';

export const metadata = { title: '[Title]' };

export default function Page() {
  return <ListView />;
}
```

**List Section:** `src/app/(dashboard)/(management)/[module]/_sections/list/index.tsx`
```typescript
'use client';

import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { PageContainer } from 'src/shared/components/page-container';
import { Breadcrumbs } from 'src/shared/components/breadcrumbs';
import { useLocales } from 'src/locales';
import { paths } from 'src/routes/paths';
import { CardTable } from './table/card-table';

export const ListView = () => {
  const { t } = useLocales();

  return (
    <PageContainer>
      <Breadcrumbs
        title={t('[Title]')}
        extra={
          <Link href={paths.[module].new}>
            <Button type="primary" icon={<PlusOutlined />}>
              {t('Thêm mới')}
            </Button>
          </Link>
        }
      />
      <CardTable />
    </PageContainer>
  );
};
```

**Card Table:** `src/app/(dashboard)/(management)/[module]/_sections/list/table/card-table.tsx`
```typescript
'use client';

import { Card } from 'antd';
import { useFetchTableData } from '../hooks/use-fetch-data';
import { FilterToolbar } from '../toolbar/filter';
import { DataTable } from './table';

export const CardTable = () => {
  const tableProps = useFetchTableData();

  return (
    <Card>
      <FilterToolbar {...tableProps} />
      <DataTable {...tableProps} />
    </Card>
  );
};
```

**Data Table:** `src/app/(dashboard)/(management)/[module]/_sections/list/table/table.tsx`
```typescript
'use client';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type Props = {
  list: T[Entity]Item[];
  isLoading: boolean;
  data?: { total: number };
  // pagination props
};

export const DataTable = ({ list, isLoading, data }: Props) => {
  const columns: ColumnsType<T[Entity]Item> = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    // ... more columns
  ];

  return (
    <Table
      columns={columns}
      dataSource={list}
      loading={isLoading}
      rowKey="_id"
      pagination={{
        total: data?.total,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} bản ghi`,
      }}
    />
  );
};
```

---

### BƯỚC 6: Tạo Form Page (New/Edit)

**New Page:** `src/app/(dashboard)/(management)/[module]/new/page.tsx`
```typescript
import { FormView } from './_sections/form-view';

export const metadata = { title: 'Thêm mới' };

export default function Page() {
  return <FormView />;
}
```

**Form View:** `src/app/(dashboard)/(management)/[module]/new/_sections/form-view.tsx`
```typescript
'use client';

import { Breadcrumbs } from 'src/shared/components/breadcrumbs';
import { useLocales } from 'src/locales';
import { MainForm } from '../_components/main-form';

export default function FormView() {
  const { t } = useLocales();

  return (
    <div style={{ padding: 24 }}>
      <Breadcrumbs title={t('Thêm mới')} style={{ marginBottom: 24 }} />
      <MainForm />
    </div>
  );
}
```

**Form Component:** `src/app/(dashboard)/(management)/[module]/new/_components/main-form.tsx`
```typescript
'use client';

import { Form, Input, Button, Card, Space, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useLocales } from 'src/locales';
import { useAdd[Entity] } from 'src/core/[domain]/hooks/use-add-[entity]';
import { getErrorMessage } from 'src/services/rest-api/app-api/error-handler';
import { paths } from 'src/routes/paths';

type TFormValues = {
  name: string;
  code: string;
  // ... more fields
};

export default function MainForm() {
  const { t } = useLocales();
  const router = useRouter();
  const [form] = Form.useForm<TFormValues>();

  const { add, isAdding } = useAdd[Entity]();

  const onFinish = async (values: TFormValues) => {
    try {
      await add(values);
      message.success('Thêm mới thành công');
      router.push(paths.[module].root);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t('Tên')}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder={t('Nhập tên')} />
        </Form.Item>

        <Form.Item
          label={t('Mã')}
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã' }]}
        >
          <Input placeholder={t('Nhập mã')} />
        </Form.Item>

        {/* More Form.Item */}

        <Form.Item>
          <Space>
            <Button onClick={() => router.back()}>
              {t('Hủy')}
            </Button>
            <Button type="primary" htmlType="submit" loading={isAdding}>
              {t('Lưu')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
```

**Edit Form (với initial values):** `src/app/(dashboard)/(management)/[module]/[id]/edit/_components/edit-form.tsx`
```typescript
'use client';

import { Form, Input, Button, Card, Space, Spin, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocales } from 'src/locales';
import { useGet[Entity]Detail } from 'src/core/[domain]/hooks/use-get-[entity]-detail';
import { useUpdate[Entity] } from 'src/core/[domain]/hooks/use-update-[entity]';
import { getErrorMessage } from 'src/services/rest-api/app-api/error-handler';
import { paths } from 'src/routes/paths';

type Props = {
  id: string;
};

export default function EditForm({ id }: Props) {
  const { t } = useLocales();
  const router = useRouter();
  const [form] = Form.useForm();

  const { data, isLoading } = useGet[Entity]Detail(id);
  const { update, isUpdating } = useUpdate[Entity]();

  // Set initial values when data loaded
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const onFinish = async (values: any) => {
    try {
      await update({ id, body: values });
      message.success('Cập nhật thành công');
      router.push(paths.[module].root);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label={t('Tên')} name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* More fields */}

        <Form.Item>
          <Space>
            <Button onClick={() => router.back()}>{t('Hủy')}</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {t('Cập nhật')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
```

---

## ✅ CHECKLIST

| # | Task | Location |
|---|------|----------|
| 1 | Tạo service instance | `services/rest-api/app-api/[service]/_service-instance.ts` |
| 2 | Tạo API endpoints | `services/rest-api/app-api/[service]/[entity].ts` |
| 3 | Thêm SWR keys | `constants/swr-keys.ts` |
| 4 | Tạo query hooks | `core/[domain]/hooks/use-get-*.ts` |
| 5 | Tạo mutation hooks | `core/[domain]/hooks/use-add-*.ts`, `use-update-*.ts` |
| 6 | Thêm routes | `routes/paths.ts` |
| 7 | Tạo list page | `app/(dashboard)/(management)/[module]/page.tsx` |
| 8 | Tạo sections | `[module]/_sections/list/` |
| 9 | Tạo form page | `[module]/new/page.tsx` |
| 10 | Tạo form components | `[module]/new/_components/` |

---

## 📦 ANT DESIGN COMPONENTS THƯỜNG DÙNG

```typescript
// Layout & Container
import { Card, Space, Row, Col, Divider } from 'antd';

// Form
import { Form, Input, Select, DatePicker, InputNumber, Switch, Checkbox, Radio } from 'antd';

// Table
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

// Buttons
import { Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

// Feedback
import { message, Modal, notification, Spin, Skeleton } from 'antd';

// Navigation
import { Breadcrumb, Menu, Dropdown } from 'antd';

// Data Entry
import { Upload, TreeSelect, Cascader, AutoComplete } from 'antd';

// Data Display
import { Tag, Badge, Tooltip, Popover, Descriptions } from 'antd';
```

---

## 🎨 FORM PATTERNS VỚI ANT DESIGN

**Form cơ bản:**
```typescript
<Form form={form} layout="vertical" onFinish={onFinish}>
  <Form.Item name="field" label="Label" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>
```

**Form với Select:**
```typescript
<Form.Item name="status" label="Trạng thái">
  <Select options={[
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Ngừng hoạt động' },
  ]} />
</Form.Item>
```

**Form với DatePicker:**
```typescript
import dayjs from 'dayjs';

<Form.Item name="date" label="Ngày">
  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
</Form.Item>
```

**Form với validation:**
```typescript
<Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true, message: 'Vui lòng nhập email' },
    { type: 'email', message: 'Email không hợp lệ' },
  ]}
>
  <Input />
</Form.Item>
```

---

## 📊 TABLE PATTERNS VỚI ANT DESIGN

**Table với pagination và sorting:**
```typescript
const columns: ColumnsType<TItem> = [
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'active' ? 'green' : 'red'}>
        {status === 'active' ? 'Hoạt động' : 'Ngừng'}
      </Tag>
    ),
  },
  {
    title: 'Thao tác',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="link" icon={<EditOutlined />} />
        <Button type="link" danger icon={<DeleteOutlined />} />
      </Space>
    ),
  },
];

<Table
  columns={columns}
  dataSource={list}
  loading={isLoading}
  rowKey="_id"
  pagination={{
    current: page,
    pageSize: limit,
    total: data?.total,
    showSizeChanger: true,
    onChange: (p, size) => setParams({ page: p, limit: size }),
  }}
  onChange={(pagination, filters, sorter) => {
    // Handle sort
  }}
/>
```

---

## 🔍 TABLE FILTER/SEARCH PATTERN (URL State)

### Cấu trúc hooks cho Table Filter

```
[module]/_sections/list/
├── card-table/
│   ├── hooks/
│   │   ├── use-table-fetching-params.ts   # Quản lý filter params + sync URL
│   │   ├── use-fetch-table-data.ts        # Fetch data từ URL params
│   │   └── use-filter-result.ts           # Xử lý filter results (optional)
│   ├── toolbars/
│   │   └── filter-options.tsx             # Form filter
│   └── index.tsx                          # Card table
```

### Hook 1: Quản lý Filter Params (sync với URL)

**File:** `hooks/use-table-fetching-params.ts`
```typescript
import { omit, pick } from 'lodash-es';
import { useMemo } from 'react';
import { TFetch[Entity]Params } from 'src/services/rest-api/app-api/[service]/[entity]';
import { PaginationParams } from 'src/services/rest-api/app-api/types';
import { useSearchParamsState } from 'src/shared/hooks/use-search-params-state';
import { fDate } from 'src/shared/utils/format-time';

// 1. Define Filter Form Type
export type TFilterOptions = {
  keyword: string;
  status: string;
  date_range: [string, string];
  // ... more filter fields
  limit: number;
};

type TTableParams = Partial<PaginationParams<TFilterOptions>>;

// 2. Default values cho filter form
export const generateDefaultParams: () => PaginationParams<TFilterOptions> = () => ({
  keyword: '',
  status: '',
  date_range: ['', ''],
  limit: 10,
});

// 3. Convert form values -> API params (nếu cần transform)
const convertToFetchingParams = (
  params: Partial<TFilterOptions>
): Partial<TFetch[Entity]Params> => {
  const dateRange = params.date_range;

  if (!dateRange) return params;

  return Object.assign(omit(params, ['date_range']), {
    start_date: fDate(dateRange[0], 'yyyy-MM-dd'),
    end_date: fDate(dateRange[1], 'yyyy-MM-dd'),
  });
};

// 4. Main hook
export const useTableFetchingParams = (isInit: boolean = true) => {
  const { params, setSearchParamsState } = useSearchParamsState(
    isInit
      ? { defaultParams: convertToFetchingParams(generateDefaultParams()) }
      : undefined
  );

  const setTableFetchingParams = (newParams: TTableParams) => {
    setSearchParamsState(convertToFetchingParams(newParams));
  };

  const tableFetchingParams = useMemo(() => {
    return Object.assign(generateDefaultParams(), params);
  }, [params]);

  return {
    tableFetchingParams,
    setTableFetchingParams,
  };
};

// 5. Convert API params -> form values (ngược lại)
export const convertToFilterFormData = (params: Partial<TFetch[Entity]Params>) => {
  return {
    ...pick(params, ['keyword', 'status']),
    date_range: [params.start_date ?? '', params.end_date ?? ''],
  } as TFilterOptions;
};
```

### Hook 2: Fetch Table Data từ URL Params

**File:** `hooks/use-fetch-table-data.ts`
```typescript
import { useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useMemo } from 'react';
import { useFetch[Entity]List } from 'src/core/[domain]/hooks';
import { TFetch[Entity]Params } from 'src/services/rest-api/app-api/[service]/[entity]';

export const useFetchTableData = () => {
  const searchParams = useSearchParams();

  // Parse URL params
  const qrParams = useMemo(() => {
    const orgParams = qs.parse(searchParams.toString()) as TFetch[Entity]Params;

    return {
      ...orgParams,
      sort: 'created_at desc',
      with: ['relation1', 'relation2'], // Relations cần load
    } as TFetch[Entity]Params;
  }, [searchParams]);

  // Fetch data
  const { data, dataList, isLoading, mutate } = useFetch[Entity]List(qrParams);

  return {
    tableData: dataList,
    data,
    isLoading,
    mutate,
  };
};

// Export type cho props
export type TTableDataProps = ReturnType<typeof useFetchTableData>;
```

### Component: Filter Toolbar

**File:** `toolbars/filter-options.tsx`
```typescript
'use client';

import { Form, Input, Select, DatePicker, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useLocales } from 'src/locales';
import {
  useTableFetchingParams,
  convertToFilterFormData,
  generateDefaultParams,
  TFilterOptions,
} from '../hooks/use-table-fetching-params';
import { TTableDataProps } from '../hooks/use-fetch-table-data';

const { RangePicker } = DatePicker;

type Props = TTableDataProps;

export function FilterOptions({ isLoading }: Props) {
  const { t } = useLocales();
  const [form] = Form.useForm<TFilterOptions>();

  const { tableFetchingParams, setTableFetchingParams } = useTableFetchingParams(false);

  // Sync form với URL params khi load
  useEffect(() => {
    const formData = convertToFilterFormData(tableFetchingParams);
    form.setFieldsValue(formData);
  }, [tableFetchingParams, form]);

  // Submit filter
  const onFinish = (values: TFilterOptions) => {
    setTableFetchingParams({ ...values, page: 1 }); // Reset page khi filter
  };

  // Reset filter
  const onReset = () => {
    form.resetFields();
    setTableFetchingParams(generateDefaultParams());
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="keyword" label={t('Tìm kiếm')}>
            <Input
              placeholder={t('Nhập từ khóa...')}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item name="status" label={t('Trạng thái')}>
            <Select
              placeholder={t('Chọn trạng thái')}
              allowClear
              options={[
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Ngừng hoạt động' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item name="date_range" label={t('Khoảng thời gian')}>
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item label=" ">
            <Space>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t('Tìm kiếm')}
              </Button>
              <Button icon={<ReloadOutlined />} onClick={onReset}>
                {t('Đặt lại')}
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
```

### Card Table (kết hợp tất cả)

**File:** `card-table/index.tsx`
```typescript
'use client';

import { Card } from 'antd';
import { useFetchTableData } from './hooks/use-fetch-table-data';
import { FilterOptions } from './toolbars/filter-options';
import { DataTable } from './table';

export const CardTable = () => {
  const tableProps = useFetchTableData();

  return (
    <Card>
      <FilterOptions {...tableProps} />
      <DataTable {...tableProps} />
    </Card>
  );
};
```

### Luồng hoạt động:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Filter Form (Ant Design Form)               │
│  - User nhập keyword, chọn status, date range...               │
│  - Submit → gọi setTableFetchingParams()                       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              useTableFetchingParams (Hook)                      │
│  - Convert form values → API params                            │
│  - Gọi setSearchParamsState() → Update URL                     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    URL Search Params                            │
│  ?keyword=abc&status=active&start_date=2024-01-01&page=1       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               useFetchTableData (Hook)                          │
│  - useSearchParams() → Đọc params từ URL                       │
│  - qs.parse() → Convert thành object                           │
│  - Gọi API với params → Return tableData, isLoading            │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Table                                 │
│  - Render dữ liệu từ tableData                                 │
│  - Pagination cũng sync với URL params                         │
└─────────────────────────────────────────────────────────────────┘
```

### Ưu điểm của pattern này:

1. **URL State** - Filter params được lưu trên URL → có thể bookmark, share link
2. **Sync 2 chiều** - URL ↔ Form luôn đồng bộ
3. **SEO friendly** - Các trang filter có URL riêng biệt
4. **Browser history** - Back/Forward hoạt động đúng với filter state
5. **Separation of concerns** - Tách biệt logic fetch data và quản lý params

---

## 🏷️ NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `use-fetch-data.ts` |
| Components | PascalCase | `CardTable` |
| Hooks | camelCase + `use` prefix | `useFetchData` |
| Types | PascalCase + `T` prefix | `TItemResponse` |
| Constants | SCREAMING_SNAKE_CASE | `FETCH_LIST` |
| Folders | kebab-case với `_` prefix cho internal | `_sections`, `_components` |
