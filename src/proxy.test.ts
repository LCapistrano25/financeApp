// 1. Definimos os objetos globais PRIMEIRO
global.Request = jest.fn() as unknown as typeof Request;
global.Response = jest.fn() as unknown as typeof Response;
global.Headers = jest.fn() as unknown as typeof Headers; // Adicionei Headers por garantia!

describe('Proxy / Middleware', () => {
  it('o arquivo de proxy deve ser importado e definido corretamente', () => {
    // 2. Importamos o arquivo DINAMICAMENTE dentro do teste
    // Isso impede o JavaScript de tentar carregar o arquivo antes dos globais existirem
    const proxy = require('./proxy');
    
    expect(proxy).toBeDefined();
  });
});