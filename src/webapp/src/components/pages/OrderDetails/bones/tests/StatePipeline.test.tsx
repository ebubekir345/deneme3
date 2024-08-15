import React from 'react';
import { Pipeline } from '@oplog/express';
import { createWithRedux, intl } from '../../../../../utils/testUtils';
import { StatePipeline } from '../StatePipeline';
import { initialState } from '../../../../../store/initState';

let component;
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ id: '123' }),
}));

describe('StatePipeline', () => {
  it('passes no data when resource is not available', () => {
    component = createWithRedux(<StatePipeline />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getSalesOrderStateDetail: {
          isBusy: false,
          isSuccess: false,
          data: undefined,
          error: undefined,
        },
      },
    });
    expect(component.root.findByType(Pipeline).props.isLoading).toBe(false);
    expect(component.root.findByType(Pipeline).props.steps).toBe(undefined);
  });

  it('sets isLoading prop to true when resource isBusy', () => {
    component = createWithRedux(<StatePipeline />, {
      ...initialState,
      resources: {
        ...initialState.resources,
        getSalesOrderStateDetail: {
          ...initialState.resources.getSalesOrderStateDetail,
          isBusy: true,
        },
      },
    });
    expect(component.root.findByType(Pipeline).props.isLoading).toBe(true);
  });

  /*   it('generates and passes modifiedPipelineData from resource data of created order', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          created: { state: 'Created', at: '2021-02-26T13:19:04.91738Z' },
          picking: { state: 'None' },
          packing: { state: 'None' },
          slam: { state: 'None' },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps).toEqual([
      {
        state: 'completed',
        subtitle: { icon: { name: 'fas fa-calendar' }, title: '26.02.2021 13:19' },
        title: 'İstek Alındı',
      },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.picking.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.packing.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.slam.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.dispatch.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.delivered.disabled" },
    ]);
  });

  it('generates and passes modifiedPipelineData from resource data of no stock order', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          created: { state: 'OutOfStock', at: '2021-02-26T12:19:04.32816Z' },
          picking: { state: 'None' },
          packing: { state: 'None' },
          slam: { state: 'None' },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps).toEqual([
      {
        state: 'cancelled',
        subtitle: { icon: { name: 'fas fa-calendar' }, title: '26.02.2021 12:19' },
        title: "OrderDetails.Pipeline.created.cancelled",
      },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.picking.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.packing.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.slam.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.dispatch.disabled" },
      { state: 'disabled', subtitle: { title: "OrderDetails.Pipeline.NotStarted" }, title: "OrderDetails.Pipeline.delivered.disabled" },
    ]);
  });

  it('generates and passes modifiedPipelineData from resource data of order in picking', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          pickingToteLabel: 'T2-SEPET-19',
          created: { state: 'Created', at: '2021-02-26T11:39:09.96334Z' },
          picking: {
            state: 'Completed',
            startedAt: '2021-02-26T11:41:56.84635Z',
            completedAt: '2021-02-26T11:54:54.55134Z',
          },
          packing: { state: 'None' },
          slam: { state: 'None' },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps[1].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[1].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '26.02.2021 11:41 - 26.02.2021 11:54',
    });
    expect(component.root.findByType(Pipeline).props.steps[1].title).toBe('Toplandı');
    expect(component.root.findByType(Pipeline).props.steps[2]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Paketlenecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[3]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Kargo Etiketlenecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[4]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Sevk Edilecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[5]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Teslim Edilecek',
    });
  });

  it('generates and passes modifiedPipelineData from resource data of order in packing', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          pickingToteLabel: 'T2-SEPET-09',
          created: { state: 'Created', at: '2021-02-26T10:39:02.3669Z' },
          picking: {
            state: 'Completed',
            startedAt: '2021-02-26T11:41:56.84523Z',
            completedAt: '2021-02-26T11:54:54.55128Z',
          },
          packing: {
            state: 'Completed',
            startedAt: '2021-02-26T13:59:03.61742Z',
            completedAt: '2021-02-26T13:59:07.78528Z',
          },
          slam: { state: 'None' },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps[1].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[1].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '26.02.2021 11:41 - 26.02.2021 11:54',
    });
    expect(component.root.findByType(Pipeline).props.steps[1].title).toBe('Toplandı');
    expect(component.root.findByType(Pipeline).props.steps[2].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[2].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '26.02.2021 13:59 - 26.02.2021 13:59',
    });
    expect(component.root.findByType(Pipeline).props.steps[2].title).toBe('Paketlendi');
    expect(component.root.findByType(Pipeline).props.steps[3]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Kargo Etiketlenecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[4]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Sevk Edilecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[5]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Teslim Edilecek',
    });
  });

  it('generates and passes modifiedPipelineData from resource data of order in packing in process', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          pickingToteLabel: 'T2-SEPET-09',
          created: { state: 'Created', at: '2021-02-26T10:39:02.3669Z' },
          picking: {
            state: 'Completed',
            startedAt: '2021-02-26T11:41:56.84523Z',
            completedAt: '2021-02-26T11:54:54.55128Z',
          },
          packing: {
            state: 'Started',
            startedAt: '2021-02-26T13:59:03.61742Z',
          },
          slam: { state: 'None' },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps[1].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[1].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '26.02.2021 11:41 - 26.02.2021 11:54',
    });
    expect(component.root.findByType(Pipeline).props.steps[1].title).toBe('Toplandı');
    expect(component.root.findByType(Pipeline).props.steps[2].state).toBe('active');
    expect(component.root.findByType(Pipeline).props.steps[2].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '26.02.2021 13:59',
    });
    expect(component.root.findByType(Pipeline).props.steps[2].title).toBe('Paketleniyor');
    expect(component.root.findByType(Pipeline).props.steps[3]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Kargo Etiketlenecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[4]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Sevk Edilecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[5]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Teslim Edilecek',
    });
  });

  it('generates and passes modifiedPipelineData from resource data of order in slam', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          pickingToteLabel: 'T2-SEPET-05',
          created: { state: 'Created', at: '2021-02-24T11:39:01.57926Z' },
          picking: {
            state: 'Completed',
            startedAt: '2021-02-25T14:38:03.69889Z',
            completedAt: '2021-02-25T14:52:02.76651Z',
          },
          packing: {
            state: 'Completed',
            startedAt: '2021-02-25T14:53:02.00127Z',
            completedAt: '2021-02-25T14:53:26.59205Z',
          },
          slam: {
            state: 'Completed',
            startedAt: '2021-02-25T15:00:10.33088Z',
            completedAt: '2021-02-25T15:00:10.33239Z',
          },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps[1].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[1].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '25.02.2021 14:38 - 25.02.2021 14:52',
    });
    expect(component.root.findByType(Pipeline).props.steps[1].title).toBe('Toplandı');
    expect(component.root.findByType(Pipeline).props.steps[2].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[2].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '25.02.2021 14:53 - 25.02.2021 14:53',
    });
    expect(component.root.findByType(Pipeline).props.steps[2].title).toBe('Paketlendi');
    expect(component.root.findByType(Pipeline).props.steps[3].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[3].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '25.02.2021 15:00 - 25.02.2021 15:00',
    });
    expect(component.root.findByType(Pipeline).props.steps[3].title).toBe('Kargo Etiketlendi');
    expect(component.root.findByType(Pipeline).props.steps[4]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Sevk Edilecek',
    });
    expect(component.root.findByType(Pipeline).props.steps[5]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Teslim Edilecek',
    });
  });

  it('generates and passes modifiedPipelineData from resource data of order in dispatch', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          pickingToteLabel: 'T2-SEPET-01',
          created: { state: 'Created', at: '2021-02-23T12:49:01.41532Z' },
          picking: {
            state: 'Completed',
            startedAt: '2021-02-24T10:31:28.36743Z',
            completedAt: '2021-02-24T10:38:13.49016Z',
          },
          packing: {
            state: 'Completed',
            startedAt: '2021-02-24T10:40:09.939Z',
            completedAt: '2021-02-24T10:40:17.862Z',
          },
          slam: { state: 'Completed', startedAt: '2021-02-24T10:40:17.862Z', completedAt: '2021-02-24T10:40:17.862Z' },
          suspended: {},
          dispatch: {
            state: 'Completed',
            startedAt: '2021-02-24T13:26:05.75557Z',
            completedAt: '2021-02-24T13:26:05.75587Z',
          },
          delivered: { state: 'None' },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps[1].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[1].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 10:31 - 24.02.2021 10:38',
    });
    expect(component.root.findByType(Pipeline).props.steps[1].title).toBe('Toplandı');
    expect(component.root.findByType(Pipeline).props.steps[2].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[2].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 10:40 - 24.02.2021 10:40',
    });
    expect(component.root.findByType(Pipeline).props.steps[2].title).toBe('Paketlendi');
    expect(component.root.findByType(Pipeline).props.steps[3].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[3].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 10:40 - 24.02.2021 10:40',
    });
    expect(component.root.findByType(Pipeline).props.steps[3].title).toBe('Kargo Etiketlendi');
    expect(component.root.findByType(Pipeline).props.steps[4].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[4].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 13:26 - 24.02.2021 13:26',
    });
    expect(component.root.findByType(Pipeline).props.steps[4].title).toBe('Sevk Edildi');
    expect(component.root.findByType(Pipeline).props.steps[5]).toEqual({
      state: 'disabled',
      subtitle: { title: 'İşlem Başlamadı' },
      title: 'Teslim Edilecek',
    });
  });

  it('generates and passes modifiedPipelineData from resource data of order in delivered', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          pickingToteLabel: 'T2-SEPET-01',
          created: { state: 'Created', at: '2021-02-23T12:49:01.41532Z' },
          picking: {
            state: 'Completed',
            startedAt: '2021-02-24T10:31:28.36743Z',
            completedAt: '2021-02-24T10:38:13.49016Z',
          },
          packing: {
            state: 'Completed',
            startedAt: '2021-02-24T10:40:09.939Z',
            completedAt: '2021-02-24T10:40:17.862Z',
          },
          slam: { state: 'Completed', startedAt: '2021-02-24T10:40:17.862Z', completedAt: '2021-02-24T10:40:17.862Z' },
          suspended: {},
          dispatch: {
            state: 'Completed',
            startedAt: '2021-02-24T13:26:05.75557Z',
            completedAt: '2021-02-24T13:26:05.75587Z',
          },
          delivered: {
            state: 'Completed',
            startedAt: '2021-02-24T13:27:05.75557Z',
            completedAt: '2021-02-24T13:27:05.75587Z',
          },
          cancelled: { state: 'None' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps[1].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[1].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 10:31 - 24.02.2021 10:38',
    });
    expect(component.root.findByType(Pipeline).props.steps[1].title).toBe('Toplandı');
    expect(component.root.findByType(Pipeline).props.steps[2].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[2].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 10:40 - 24.02.2021 10:40',
    });
    expect(component.root.findByType(Pipeline).props.steps[2].title).toBe('Paketlendi');
    expect(component.root.findByType(Pipeline).props.steps[3].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[3].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 10:40 - 24.02.2021 10:40',
    });
    expect(component.root.findByType(Pipeline).props.steps[3].title).toBe('Kargo Etiketlendi');
    expect(component.root.findByType(Pipeline).props.steps[4].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[4].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 13:26 - 24.02.2021 13:26',
    });
    expect(component.root.findByType(Pipeline).props.steps[4].title).toBe('Sevk Edildi');
    expect(component.root.findByType(Pipeline).props.steps[5].state).toBe('completed');
    expect(component.root.findByType(Pipeline).props.steps[5].subtitle).toEqual({
      icon: { name: 'fas fa-calendar' },
      title: '24.02.2021 13:27 - 24.02.2021 13:27',
    });
    expect(component.root.findByType(Pipeline).props.steps[5].title).toBe('Teslim Edildi');
  });

  it('generates and passes modifiedPipelineData from resource data of order in cancelled', () => {
    props = {
      ...props,
      salesOrderStateDetail: {
        ...props.salesOrderStateDetail,
        isSuccess: true,
        data: {
          created: { state: 'Created', at: '2020-12-22T19:19:01.67333Z' },
          picking: { state: 'None' },
          packing: { state: 'None' },
          slam: { state: 'None' },
          suspended: {},
          dispatch: { state: 'None' },
          delivered: { state: 'None' },
          cancelled: { state: 'Cancelled', at: '2020-12-23T09:33:12.53265Z' },
        },
      },
    };
    act(() => {
      component = createWithIntl(<StatePipeline {...props} />);
    });
    expect(component.root.findByType(Pipeline).props.steps).toEqual([
      {
        state: 'completed',
        subtitle: { icon: { name: 'fas fa-calendar' }, title: '22.12.2020 19:19' },
        title: 'İstek Alındı',
      },
      {
        state: 'cancelled',
        subtitle: { icon: { name: 'fas fa-calendar' }, title: '23.12.2020 09:33' },
        title: 'İptal Edildi',
      },
    ]);
  }); */
});
