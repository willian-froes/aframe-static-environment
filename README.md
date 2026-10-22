# aframe-static-environment

## Getting started

Access the link to run A-Frame hello world example with basic 3D shapes.

```
https://willian-froes.github.io/aframe-static-environment/
```

## VR no iPhone 14

1. Abra o endereço acima no Safari, por **HTTPS**, depois de publicar as alterações.
2. Toque em **Permitir** e autorize o acesso a movimento e orientação no Safari.
3. Desative o bloqueio de rotação e coloque o iPhone na horizontal.
4. Toque em **Entrar em VR (Cardboard)** e coloque o aparelho em um visor compatível.
5. Para voltar à visualização normal, toque em **Sair do VR**.

O projeto usa A-Frame 1.8.0, que não inclui mais o modo Cardboard antigo.
O arquivo `mobile-vr.js` oferece renderização estereoscópica em duas metades
da tela e usa os sensores através de `look-controls`. O botão WebXR do A-Frame
continua disponível para dispositivos compatíveis.

Este modo para celular não depende de WebXR nem de tela cheia do Safari.
Ele acompanha a rotação do aparelho, sem rastreamento da posição física,
e não aplica correção de distorção ou calibração específica das lentes do visor.
As barras do Safari podem continuar visíveis. A aparência e o conforto precisam
ser conferidos no iPhone e no visor usados.

Para desenvolvimento no aparelho, sirva o projeto por HTTPS com certificado
confiável. Um endereço HTTP da rede local não libera os sensores do iOS.
Se a permissão for negada, revise as permissões do site no Safari e recarregue.

### Verificação manual no aparelho

- Autorizar sensores, entrar em VR e conferir as duas imagens e a rotação da câmera.
- Girar entre retrato e paisagem e conferir o redimensionamento.
- Sair e entrar novamente, verificando que a imagem normal é restaurada.
- Negar a permissão e conferir a mensagem ao tentar entrar em VR.
- Conferir o modo normal no desktop e o modo WebXR em um dispositivo compatível.

Referências: [interface XR do A-Frame 1.8.0](https://github.com/aframevr/aframe/blob/v1.8.0/src/components/scene/xr-mode-ui.js)
e [permissões de orientação](https://github.com/aframevr/aframe/blob/v1.8.0/docs/components/device-orientation-permission-ui.md).
