import { urls } from '../../../routers/urls';
import { linkFormatter } from '../linkFormatters';

describe('linkFormatter', () => {
  it('should match snapshot without intlKey', () => {
    var props = {
      value: 'mock',
      dependentValues: { productId: 'order-2' },
    };
    var url = linkFormatter(null, urls.productDetailsForOtherRoutes, false, false, 'productId')(props);
    expect(url.props.to).toEqual('/products/order-2/:tab?');
  });
});
