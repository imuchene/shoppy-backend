import { WsAuthGuard } from '../ws-auth.guard';

describe('ProductsGuard', () => {
  it('should be defined', () => {
    expect(new WsAuthGuard()).toBeDefined();
  });
});
