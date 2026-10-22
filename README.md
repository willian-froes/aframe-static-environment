# aframe-static-environment

## Getting started

Access the link to run A-Frame hello world example with basic 3D shapes.

```
https://willian-froes.github.io/aframe-static-environment/
```

## VR no iPhone 14

1. Abra o endereço acima no Safari, por **HTTPS**, depois de publicar as alterações.
2. Toque em **Permitir** e autorize o acesso a movimento e orientação no Safari.
3. Desative o bloqueio de rotação e coloque o iPhone na horizontal: o modo
   Cardboard entra automaticamente, com duas imagens e bordas pretas arredondadas.
4. Volte à vertical para sair do VR. Não há botão ou painel de saída sobre a imagem.

O arquivo `mobile-vr.js` implementa a renderização estereoscópica para celulares
no A-Frame 1.8.0 e usa os sensores através de `look-controls`. A orientação inicial
também é respeitada: abrir na horizontal já ativa o modo Cardboard, e abrir na
vertical mantém uma única imagem. O pedido inicial de permissão dos sensores
continua necessário no iOS. O modo WebXR permanece disponível em dispositivos compatíveis.

### Tela cheia

Para usar no iPhone sem as barras do Safari, abra o site pelo menu de compartilhar,
selecione **Adicionar à Tela de Início** (habilite **Abrir como App da Web** caso
essa opção apareça) e inicie pelo ícone criado. O projeto inclui um manifesto com
`display: fullscreen`, orientação livre e metadados de aplicativo para iOS.
O sistema pode aplicar seu próprio modo de exibição e manter indicadores do sistema.

Na aba comum, o projeto solicita tela cheia quando o navegador oferece essa API.
A rotação sozinha pode ser recusada por falta de interação do usuário: nesse caso,
um toque na cena horizontal tenta novamente. No Safari sem suporte a tela cheia
para elementos HTML, as barras continuam sob controle do navegador. A tela dividida
funciona mesmo quando a solicitação é recusada. Ao voltar à vertical, a tela cheia
solicitada pelo projeto também é encerrada.

As bordas pretas simulam o recorte visual do Cardboard. Não há calibração de lentes
nem correção óptica de distorção específica de cada visor. O rastreamento acompanha
a rotação, sem rastrear a posição física do aparelho.

Para desenvolvimento no aparelho, sirva o projeto por HTTPS com certificado
confiável. Um endereço HTTP da rede local não libera os sensores do iOS.
Se a permissão for negada, revise as permissões do site no Safari e recarregue.

### Verificação manual no aparelho

- Autorizar sensores, entrar em VR e conferir as duas imagens e a rotação da câmera.
- Girar entre retrato e paisagem e conferir o redimensionamento.
- Abrir em cada orientação e alternar repetidamente: vertical com uma imagem e horizontal com duas, sem painel.
- Conferir as bordas pretas, a abertura pela Tela de Início e o toque para tela cheia em navegadores compatíveis.
- Negar a permissão e conferir que a cena continua renderizando, sem rastreamento pelos sensores.
- Conferir o modo normal no desktop e o modo WebXR em um dispositivo compatível.

Referências: [interface XR do A-Frame 1.8.0](https://github.com/aframevr/aframe/blob/v1.8.0/src/components/scene/xr-mode-ui.js)
e [permissões de orientação](https://github.com/aframevr/aframe/blob/v1.8.0/docs/components/device-orientation-permission-ui.md).

A [API de tela cheia exige interação do usuário](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen).
