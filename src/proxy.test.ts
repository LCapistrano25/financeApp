// 1. Definimos os objetos globais PRIMEIRO
global.Request = jest.fn() as unknown as typeof Request;
global.Response = jest.fn() as unknown as typeof Response;
global.Headers = jest.fn() as unknown as typeof Headers;

describe('Proxy / Middleware', () => {
  // ATENÇÃO: Adicionamos o "async" aqui
  it('o arquivo de proxy deve ser importado e definido corretamente', async () => {
    // 2. Importamos o arquivo DINAMICAMENTE usando o padrão moderno (ES Modules)
    const proxy = await import('./proxy');
    
    expect(proxy).toBeDefined();
  });
});