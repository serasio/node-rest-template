const request = require('supertest');
const Koa = require('koa');
const errorHandlerMiddleware = require('../../middlewares/errorHandler');

describe('errorHandlerMiddleware', () => {
  const testErrorCode = 'TEST_ERROR_CODE';
  const testErrorMap = { [testErrorCode]: 400 };

  def('app', () => {
    const app = new Koa();
    app.use(errorHandlerMiddleware(testErrorMap));
    return app;
  });

  afterEach(() => {
    get('server').close();
  });

  subject(() => request(get('server')).get('/'));

  describe('when there is no error', () => {
    def('server', () => {
      get('app').use((ctx) => {
        ctx.status = 203;
        ctx.body = { value: 'testing' };
      });
      return get('app').listen();
    });

    it('returns the expected status and response', async () => {
      const response = await subject();
      expect(response.status).toEqual(203);
      expect(response.body).toEqual({ value: 'testing' });
    });
  });

  describe('when there is an error', () => {
    def('server', () => {
      get('app').use(() => {
        throw get('appError');
      });
      return get('app').listen();
    });

    describe('and it is expected', () => {
      def('appError', () => ({ value: 'testing error', code: testErrorCode }));

      it('returns the expected status and response', async () => {
        const response = await subject();
        expect(response.status).toEqual(testErrorMap[testErrorCode]);
        expect(response.body).toEqual({ error: get('appError') });
      });
    });

    describe('and it is NOT expected', () => {
      def('appError', () => ({ value: 'testing error', code: 'Some unexpected code' }));

      it('returns 500 and a generic response', async () => {
        const response = await subject();
        expect(response.status).toEqual(500);
        expect(response.body).toEqual({ error: 'Internal Server Error' });
      });
    });
  });
});
