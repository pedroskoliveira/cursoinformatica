import { DayLesson } from '../types';

export const DEFAULT_LESSONS: DayLesson[] = [
  {
    "day": 1,
    "title": "Dia 1: Anatomia do Computador & Hardware Essencial",
    "subtitle": "Compreenda a diferença entre Hardware e Software, CPU, Memória RAM, Armazenamento e Periféricos.",
    "durationSeconds": 120,
    "videoUrl": "/videos/1789256368739_aula1.mp4",
    "videoType": "mp4",
    "videoUrls": [
      "/videos/1789256368739_aula1.mp4",
      "/videos/06_aula_2.mp4",
      "/videos/08_aula_4.mp4",
      "/videos/10_aula_5.mp4",
      "/videos/11_aula_6.mp4"
    ],
    "isReleased": true,
    "summary": [
      "Hardware é a parte física (tudo que você pode tocar), e Software são os programas e sistemas.",
      "A CPU (Processador) é o cérebro da máquina, responsável por realizar todos os cálculos.",
      "A Memória RAM é ultrarrápida e temporária: apaga tudo quando o computador é desligado.",
      "O Armazenamento (SSD / HD) guarda arquivos permanentemente.",
      "Periféricos de entrada enviam dados (Teclado, Mouse), de saída exibem dados (Monitor, Caixa de Som)."
    ],
    "questions": [
      {
        "id": "d1_q1",
        "question": "Qual é o componente considerado o \"cérebro\" do computador, que executa instruções e cálculos?",
        "options": [
          "Memória RAM",
          "Processador (CPU)",
          "Disco Rígido (HD/SSD)",
          "Fonte de Alimentação"
        ],
        "correctIndex": 1,
        "explanation": "A CPU (Unidade Central de Processamento) gerencia e executa todas as instruções dos programas."
      },
      {
        "id": "d1_q2",
        "question": "O que acontece com as informações armazenadas na Memória RAM quando o computador é desligado?",
        "options": [
          "Ficam salvas permanentemente no disco",
          "São enviadas automaticamente para a nuvem",
          "São totalmente apagadas por ser uma memória volátil",
          "Ficam gravadas na placa de vídeo"
        ],
        "correctIndex": 2,
        "explanation": "A memória RAM é volátil; ela requer energia elétrica contínua para reter os dados abertos."
      },
      {
        "id": "d1_q3",
        "question": "Assinale a alternativa que contém apenas periféricos de ENTRADA de dados:",
        "options": [
          "Monitor e Impressora",
          "Teclado e Mouse",
          "Caixa de som e Projetor",
          "Monitor e Fone de ouvido"
        ],
        "correctIndex": 1,
        "explanation": "Teclado e mouse enviam comandos do usuário para dentro do computador."
      },
      {
        "id": "d1_q4",
        "question": "Qual a principal vantagem de um SSD em comparação ao antigo HD mecânico?",
        "options": [
          "O SSD é muito mais rápido no carregamento do sistema e programas",
          "O SSD consome muito mais energia elétrica",
          "O SSD possui partes mecânicas que giram mais rápido",
          "O SSD não permite salvar fotos ou vídeos"
        ],
        "correctIndex": 0,
        "explanation": "Por usar memória flash sem peças mecânicas, o SSD é até 10x mais veloz que um HD tradicional."
      },
      {
        "id": "d1_q5",
        "question": "Qual é a definição correta de Software?",
        "options": [
          "Os cabos e conectores de energia do gabinete",
          "O conjunto de programas, aplicativos e instruções que dizem ao hardware o que fazer",
          "Apenas a tela de vidro do monitor",
          "O botão de ligar e desligar"
        ],
        "correctIndex": 1,
        "explanation": "Software são as instruções lógicas e aplicativos executados no hardware físico."
      }
    ]
  },
  {
    "day": 2,
    "title": "Dia 2: Sistema Operacional & Navegando no Desktop",
    "subtitle": "Aprenda a operar a Área de Trabalho, janelas, pastas, arquivos e o Explorador.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "O Sistema Operacional (Windows, Linux, macOS) é a ponte que conecta o usuário ao hardware.",
      "A Barra de Tarefas exibe programas abertos, relógio, conexões de rede e o menu Iniciar.",
      "Janelas podem ser Minimizadas (oculta na barra), Maximizadas (tela cheia) ou Fechadas (X).",
      "Pastas e subpastas servem para categorizar documentos com clareza.",
      "Extensões de arquivos (.docx, .pdf, .xlsx, .jpg) indicam o formato e qual aplicativo os abre."
    ],
    "questions": [
      {
        "id": "d2_q1",
        "question": "Qual é a função básica do Sistema Operacional (ex: Windows)?",
        "options": [
          "Apenas exibir protetores de tela coloridos",
          "Gerenciar o hardware, executar aplicativos e fornecer interface ao usuário",
          "Impedir que o computador se conecte à internet",
          "Substituir a necessidade de memória RAM"
        ],
        "correctIndex": 1,
        "explanation": "O sistema operacional orquestra todos os recursos do computador e serve como interface principal."
      },
      {
        "id": "d2_q2",
        "question": "Ao clicar no botão \"Minimizar\" de uma janela (ícone do tracinho _), o que acontece?",
        "options": [
          "O aplicativo é encerrado e os dados são perdidos",
          "A janela fica guardada na Barra de Tarefas sem fechar o programa",
          "O computador reinicia imediatamente",
          "O arquivo é enviado para a Lixeira"
        ],
        "correctIndex": 1,
        "explanation": "Minimizar recolhe a janela para a barra de tarefas, mantendo o programa em execução."
      },
      {
        "id": "d2_q3",
        "question": "Qual ferramenta do Windows é utilizada para criar pastas, mover arquivos e organizar documentos?",
        "options": [
          "Calculadora",
          "Explorador de Arquivos (File Explorer)",
          "Paint",
          "Bloco de Notas"
        ],
        "correctIndex": 1,
        "explanation": "O Explorador de Arquivos é o gerenciador padrão de arquivos e diretórios."
      },
      {
        "id": "d2_q4",
        "question": "O que representa a terminação final de um arquivo, como \".pdf\" ou \".docx\"?",
        "options": [
          "O preço do arquivo na loja oficial",
          "A extensão do arquivo, que define seu formato e tipo",
          "A senha de segurança do arquivo",
          "O número de páginas do documento"
        ],
        "correctIndex": 1,
        "explanation": "Extensões indicam o formato do arquivo para que o sistema saiba qual software usar."
      },
      {
        "id": "d2_q5",
        "question": "Se você enviar um arquivo para a \"Lixeira\" por engano, ainda é possível recuperá-lo?",
        "options": [
          "Não, ele é destruído imediatamente no mesmo segundo",
          "Sim, abrindo a Lixeira e selecionando a opção \"Restaurar\"",
          "Apenas se você comprar um novo HD",
          "Apenas chamando suporte técnico presencial"
        ],
        "correctIndex": 1,
        "explanation": "Arquivos na lixeira permanecem armazenados até que ela seja esvaziada definitivamente."
      }
    ]
  },
  {
    "day": 3,
    "title": "Dia 3: Domínio do Teclado & Atalhos Indispensáveis",
    "subtitle": "Conheça o padrão ABNT2, teclas modificadoras e atalhos que multiplicam sua agilidade.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "O teclado brasileiro ABNT2 se destaca pela presença da tecla Ç e Alt Gr.",
      "Ctrl + C (Copiar), Ctrl + V (Colar) e Ctrl + X (Recortar) economizam horas de trabalho.",
      "Ctrl + Z desfaz a última ação cometida por engano.",
      "Alt + Tab permite alternar instantaneamente entre janelas e aplicativos abertos.",
      "A tecla Windows (Win) abre o menu iniciar e combina com Win+D para mostrar a Área de Trabalho."
    ],
    "questions": [
      {
        "id": "d3_q1",
        "question": "Qual é o atalho universal de teclado utilizado para COPIAR um texto ou arquivo selecionado?",
        "options": [
          "Ctrl + P",
          "Ctrl + C",
          "Ctrl + V",
          "Alt + F4"
        ],
        "correctIndex": 1,
        "explanation": "Ctrl + C copia o item selecionado para a Área de Transferência."
      },
      {
        "id": "d3_q2",
        "question": "Se você apagou um parágrafo por engano no seu texto, qual atalho desfaz essa ação?",
        "options": [
          "Ctrl + Z",
          "Ctrl + Y",
          "Ctrl + W",
          "Shift + Esc"
        ],
        "correctIndex": 0,
        "explanation": "Ctrl + Z é o atalho clássico de \"Desfazer\" (Undo) na maioria dos programas."
      },
      {
        "id": "d3_q3",
        "question": "Para alternar rapidamente entre programas abertos sem usar o mouse, qual combinação usamos?",
        "options": [
          "Ctrl + Esc",
          "Alt + Tab",
          "Shift + Espaço",
          "Tab + Enter"
        ],
        "correctIndex": 1,
        "explanation": "Alt + Tab abre a lista visual de janelas ativas para troca rápida."
      },
      {
        "id": "d3_q4",
        "question": "Qual tecla deve ser pressionada para digitar os terceiros símbolos de uma tecla (como ª, º ou §)?",
        "options": [
          "Caps Lock",
          "Alt Gr",
          "Ctrl",
          "Tab"
        ],
        "correctIndex": 1,
        "explanation": "A tecla Alt Gr (Alt Gráfico) ativa o terceiro caractere mapeado na tecla no teclado ABNT2."
      },
      {
        "id": "d3_q5",
        "question": "Qual atalho seleciona TODO o conteúdo de uma página ou pasta no sistema em português?",
        "options": [
          "Ctrl + A",
          "Ctrl + S",
          "Ctrl + T (ou Ctrl + A dependendo do app)",
          "Ctrl + N"
        ],
        "correctIndex": 2,
        "explanation": "No Windows em português do Brasil, Ctrl + A ou Ctrl + T é o atalho padrão de seleção total."
      }
    ]
  },
  {
    "day": 4,
    "title": "Dia 4: Internet, Navegadores & Pesquisas Estratégicas",
    "subtitle": "Navegação segura, anatomia de uma URL, abas, favoritos e técnicas de busca no Google.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "Navegadores (Google Chrome, Microsoft Edge, Firefox) interpretam códigos da internet em páginas visuais.",
      "Uma URL é o endereço único de uma página (ex: https://www.exemplo.com.br).",
      "O cadeado de segurança e https:// indicam conexão criptografada entre seu computador e o site.",
      "Uso de abas (Ctrl + T para abrir, Ctrl + W para fechar) evita abrir múltiplas janelas pesadas.",
      "Usar aspas \"termo exato\" no Google filtra resultados que contêm rigorosamente aquela frase."
    ],
    "questions": [
      {
        "id": "d4_q1",
        "question": "Qual a principal diferença entre a barra de endereços (URL) e a barra de pesquisa do Google?",
        "options": [
          "A barra de endereço requer o endereço direto do site (ex: site.com), enquanto a pesquisa busca palavras-chave",
          "Não há diferença, ambas servem apenas para calcular contas",
          "A barra de endereços só funciona se o computador estiver desconectado",
          "A barra de pesquisa só aceita números de telefone"
        ],
        "correctIndex": 0,
        "explanation": "A barra de URL direciona diretamente ao servidor do domínio, enquanto o buscador rastreia termos indexados."
      },
      {
        "id": "d4_q2",
        "question": "O que indica a presença do prefixo \"HTTPS\" e do ícone de cadeado na barra de endereços?",
        "options": [
          "Que o site não tem nenhum tipo de anúncio",
          "Que a comunicação entre seu navegador e o site é criptografada e segura",
          "Que o site pertence ao governo federal",
          "Que o site é gratuito para downloads ilimitados"
        ],
        "correctIndex": 1,
        "explanation": "HTTPS (Hypertext Transfer Protocol Secure) garante que seus dados trafegam de forma criptografada."
      },
      {
        "id": "d4_q3",
        "question": "Para fechar rapidamente a aba que você está usando sem fechar o navegador inteiro, qual atalho serve?",
        "options": [
          "Ctrl + W",
          "Ctrl + N",
          "Ctrl + Shift + Del",
          "Alt + F4"
        ],
        "correctIndex": 0,
        "explanation": "Ctrl + W fecha a aba ativa atual."
      },
      {
        "id": "d4_q4",
        "question": "Como você faz para que o Google busque EXATAMENTE uma frase inteira, sem trocar palavras?",
        "options": [
          "Colocar a frase entre aspas duplas: \"frase exata\"",
          "Escrever tudo em letras maiúsculas com exclamação",
          "Escrever a palavra BUSCA antes de cada letra",
          "Colocar ponto de interrogação no início de cada palavra"
        ],
        "correctIndex": 0,
        "explanation": "O operador de aspas duplas no Google força a correspondência exata dos termos."
      },
      {
        "id": "d4_q5",
        "question": "Para que serve o recurso de \"Favoritos\" (Bookmarks) nos navegadores?",
        "options": [
          "Para salvar os sites mais importantes e acessá-los com 1 clique",
          "Para apagar o histórico de navegação",
          "Para aumentar a velocidade da internet residencial",
          "Para baixar todos os arquivos de um site no computador"
        ],
        "correctIndex": 0,
        "explanation": "Favoritos armazenam atalhos visuais para suas páginas mais visitadas."
      }
    ]
  },
  {
    "day": 5,
    "title": "Dia 5: E-mail Profissional & Comunicação Digital",
    "subtitle": "Estruturação de e-mails, anexos, etiqueta digital e a diferença crucial entre CC e CCO.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "O campo \"Para\" é destinado aos destinatários principais da mensagem.",
      "O campo \"CC\" (Com Cópia) informa pessoas que precisam acompanhar sem ser o foco direto.",
      "O campo \"CCO\" (Cópia Oculta) oculta os endereços, preservando a privacidade dos destinatários.",
      "O campo \"Assunto\" deve ser curto, objetivo e indicar claramente o conteúdo.",
      "Arquivos anexados possuem limites de tamanho (geralmente 25MB por mensagem)."
    ],
    "questions": [
      {
        "id": "d5_q1",
        "question": "Quando você deve usar o campo CCO (Cópia Oculta) ao enviar um e-mail?",
        "options": [
          "Quando você quer que todos os destinatários vejam os contatos uns dos outros",
          "Quando você envia para vários contatos e precisa proteger a privacidade dos e-mails",
          "Quando o e-mail não possui nenhum anexo",
          "Apenas ao enviar e-mails para amigos próximos"
        ],
        "correctIndex": 1,
        "explanation": "O CCO oculta a lista de destinatários, evitando vazamento de dados de contato."
      },
      {
        "id": "d5_q2",
        "question": "Por que o campo \"Assunto\" é tão fundamental em um e-mail profissional?",
        "options": [
          "Porque sem assunto o e-mail não gasta eletricidade",
          "Porque resume o tema da mensagem e evita que ela caia na caixa de spam",
          "Porque substitui o corpo do texto",
          "Porque impede que o destinatário responda"
        ],
        "correctIndex": 1,
        "explanation": "Um assunto descritivo ajuda na priorização, arquivamento e evita filtros de spam."
      },
      {
        "id": "d5_q3",
        "question": "Qual o tamanho limite médio usual de arquivos que podem ser anexados em serviços como Gmail/Outlook?",
        "options": [
          "10 GB",
          "Aproximadamente 20 MB a 25 MB",
          "100 MB",
          "Ilimitado sem restrições"
        ],
        "correctIndex": 1,
        "explanation": "Serviços de e-mail limitam anexos diretos a cerca de 25 MB (para tamanhos maiores, usa-se links em nuvem)."
      },
      {
        "id": "d5_q4",
        "question": "Qual é uma regra básica de etiqueta (Netiqueta) na escrita de e-mails?",
        "options": [
          "Escrever o texto todo em CAIXA ALTA (Caps Lock), pois simula que você está gritando",
          "Manter saudação cordial, mensagem clara, sem erros grosseiros e com despedida respeitosa",
          "Nunca assinar seu nome no final da mensagem",
          "Encaminhar correntes de sorte para todos os colegas"
        ],
        "correctIndex": 1,
        "explanation": "Clareza, cordialidade e pontuação adequada caracterizam uma comunicação profissional."
      },
      {
        "id": "d5_q5",
        "question": "Ao receber um e-mail suspeito pedindo sua senha bancária, qual a conduta correta?",
        "options": [
          "Responder imediatamente com os dados solicitados",
          "Não clicar em nenhum link, não baixar anexos e marcar como Spam / Phishing",
          "Encaminhar para todos os amigos para eles testarem",
          "Preencher apenas metade da senha"
        ],
        "correctIndex": 1,
        "explanation": "Bancos e instituições nunca solicitam senhas ou dados sigilosos por e-mail."
      }
    ]
  },
  {
    "day": 6,
    "title": "Dia 6: Segurança Digital Básica & Prevenção de Golpes",
    "subtitle": "Identificação de Phishing, criação de senhas invioláveis e autenticação em dois fatores.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "Phishing é o golpe onde criminosos usam e-mails e páginas falsas para roubar senhas e dados.",
      "Senhas fortes combinam maiúsculas, minúsculas, números, símbolos e têm pelo menos 12 caracteres.",
      "Nunca reutilize a mesma senha em sites bancários, e-mails e lojas virtuais.",
      "Autenticação em Dois Fatores (2FA) adiciona uma segunda camada indispensável de segurança.",
      "Desconfie de promoções absurdas, links encurtados e ameaças de bloqueio de contas urgentes."
    ],
    "questions": [
      {
        "id": "d6_q1",
        "question": "O que caracteriza o ataque cibernético conhecido como \"Phishing\"?",
        "options": [
          "Um vírus que queima a placa mãe fisicamente",
          "Uma tentativa de \"pescar\" dados sigilosos simulando ser uma empresa ou pessoa confiável",
          "Um programa para consertar o teclado travado",
          "Um tipo de backup automático"
        ],
        "correctIndex": 1,
        "explanation": "Phishing engana a vítima com mensagens urgentes para induzi-la a fornecer credenciais."
      },
      {
        "id": "d6_q2",
        "question": "Qual das seguintes senhas é a mais segura e recomendada segundo as boas práticas?",
        "options": [
          "12345678",
          "senha123",
          "computador2024",
          "K#9m$P!x7@Qw"
        ],
        "correctIndex": 3,
        "explanation": "Combina caracteres especiais, números, letras maiúsculas e minúsculas sem palavras previsíveis do dicionário."
      },
      {
        "id": "d6_q3",
        "question": "O que é a Autenticação em Duas Etapas (2FA)?",
        "options": [
          "Digitar a mesma senha duas vezes seguidas",
          "Uma camada extra de segurança que exige um código temporário além da senha no login",
          "Ter dois computadores ligados ao mesmo tempo",
          "Trocar de senha a cada 5 minutos"
        ],
        "correctIndex": 1,
        "explanation": "O 2FA exige algo que você sabe (senha) e algo que você tem (código via app/celular)."
      },
      {
        "id": "d6_q4",
        "question": "Por que NÃO se deve usar a mesma senha para seu e-mail e outros cadastros na internet?",
        "options": [
          "Porque a internet fica lenta",
          "Porque se um site menos seguro vazar seus dados, os invasores terão acesso ao seu e-mail principal",
          "Porque o teclado quebra mais rápido",
          "Porque o Windows não permite senhas repetidas"
        ],
        "correctIndex": 1,
        "explanation": "O vazamento de uma credencial repetida compromete todas as outras contas associadas."
      },
      {
        "id": "d6_q5",
        "question": "Qual procedimento deve ser feito ao usar o computador em uma lan house ou biblioteca pública?",
        "options": [
          "Salvar todas as senhas no navegador para a próxima pessoa",
          "Encerrar a sessão (Fazer Logout) de todas as contas e não salvar credenciais no navegador",
          "Deixar a tela aberta para não gastar energia",
          "Desinstalar o antivírus da máquina"
        ],
        "correctIndex": 1,
        "explanation": "Fazer logout e fechar o navegador garante que seu login não fique gravado na máquina pública."
      }
    ]
  },
  {
    "day": 7,
    "title": "Dia 7: Produção & Formatação de Textos (Word / Docs)",
    "subtitle": "Formatação profissional, espaçamento, estilos de parágrafo e exportação segura em PDF.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "Processadores de texto permitem criar ofícios, relatórios, currículos e trabalhos acadêmicos.",
      "Formatações básicas: Negrito (ênfase), Itálico (termos estrangeiros/citações), Sublinhado.",
      "Alinhamento do texto: À esquerda (padrão), Centralizado (títulos), Justificado (textos formais).",
      "Margens e espaçamento de 1,5 linha facilitam a leitura visual de documentos longos.",
      "Exportar para PDF (.pdf) garante que o documento não desconfigure em outro computador ou celular."
    ],
    "questions": [
      {
        "id": "d7_q1",
        "question": "Qual alinhamento distribui o texto uniformemente entre as margens esquerda e direita?",
        "options": [
          "Alinhamento Centralizado",
          "Alinhamento Justificado",
          "Alinhamento Superior",
          "Alinhamento Diagonal"
        ],
        "correctIndex": 1,
        "explanation": "O texto justificado preenche o espaço de ponta a ponta, conferindo padrão estético editorial."
      },
      {
        "id": "d7_q2",
        "question": "Por que é altamente recomendado enviar currículos e relatórios finais no formato PDF?",
        "options": [
          "Porque o PDF é um arquivo de áudio",
          "Porque o PDF preserva a formatação exata, impedindo alterações acidentais em qualquer dispositivo",
          "Porque o PDF só abre se você tiver internet rápida",
          "Porque o PDF é mais leve que um bloco de notas"
        ],
        "correctIndex": 1,
        "explanation": "O formato PDF (Portable Document Format) preserva layout e fontes em qualquer plataforma."
      },
      {
        "id": "d7_q3",
        "question": "Qual estilo tipográfico é tradicionalmente aplicado para destacar palavras em idioma estrangeiro?",
        "options": [
          "Negrito",
          "Itálico",
          "Riscado",
          "Tamanho gigante"
        ],
        "correctIndex": 1,
        "explanation": "O itálico é a convenção gráfica padrão para estrangeirismos e títulos de obras."
      },
      {
        "id": "d7_q4",
        "question": "Qual a função de inserir um \"Cabeçalho\" ou \"Rodapé\" em um documento?",
        "options": [
          "Fazer o arquivo sumir automaticamente",
          "Repetir informações (como número de página e título) no topo ou base de todas as páginas",
          "Adicionar vírus ao documento",
          "Bloquear a impressão"
        ],
        "correctIndex": 1,
        "explanation": "Cabeçalhos e rodapés aparecem de forma consistente em todas as páginas do trabalho."
      },
      {
        "id": "d7_q5",
        "question": "Em um documento do Word/Docs, qual o comando para localizar uma palavra específica no texto?",
        "options": [
          "Ctrl + L (ou Ctrl + F)",
          "Ctrl + P",
          "Alt + F4",
          "Ctrl + N"
        ],
        "correctIndex": 0,
        "explanation": "Ctrl + L no Word em português (ou Ctrl + F no Docs) abre a ferramenta de busca de palavras."
      }
    ]
  },
  {
    "day": 8,
    "title": "Dia 8: Introdução Prática a Planilhas (Excel / Sheets)",
    "subtitle": "Compreenda linhas, colunas, células, operações matemáticas e fórmulas SOMA e MÉDIA.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "Planilhas são compostas por Colunas (identificadas por letras) e Linhas (por números).",
      "Uma Célula é o cruzamento de uma coluna com uma linha (ex: Célula B4).",
      "Toda fórmula ou cálculo em uma planilha DEVE começar obrigatoriamente com o sinal de igual (=).",
      "A função =SOMA(A1:A10) soma todos os valores contidos no intervalo de A1 até A10.",
      "A função =MÉDIA(B1:B5) calcula o valor médio aritmético dos números selecionados."
    ],
    "questions": [
      {
        "id": "d8_q1",
        "question": "Como é identificada uma célula localizada na coluna C e na linha 7 de uma planilha?",
        "options": [
          "7C",
          "C7",
          "C-linha-7",
          "Col7"
        ],
        "correctIndex": 1,
        "explanation": "A convenção padrão de planilhas coloca primeiro a letra da coluna e depois o número da linha: C7."
      },
      {
        "id": "d8_q2",
        "question": "Com qual símbolo OBRIGATÓRIO deve-se iniciar qualquer fórmula ou cálculo no Excel/Google Sheets?",
        "options": [
          "Sinal de cerquilha (#)",
          "Sinal de arroba (@)",
          "Sinal de igual (=)",
          "Ponto de exclamação (!)"
        ],
        "correctIndex": 2,
        "explanation": "O sinal de igual (=) avisa ao software de planilha que o conteúdo digitado é uma expressão a ser calculada."
      },
      {
        "id": "d8_q3",
        "question": "Qual fórmula realiza a soma dos valores contidos entre as células A1 até A5?",
        "options": [
          "=ADICIONAR(A1+A5)",
          "=SOMA(A1:A5)",
          "=TOTAL(A1-A5)",
          "=CALC(A1,A5)"
        ],
        "correctIndex": 1,
        "explanation": "A sintaxe =SOMA(A1:A5) utiliza dois pontos (:) para representar o intervalo contínuo de A1 até A5."
      },
      {
        "id": "d8_q4",
        "question": "Para calcular a média das notas de um aluno contidas nas células B2, B3 e B4, qual fórmula usamos?",
        "options": [
          "=MEDIA(B2:B4)",
          "=DIVIDIR(B2..B4)",
          "=MEDIANA_SOMA(B2:B4)",
          "=CONTAR(B2:B4)"
        ],
        "correctIndex": 0,
        "explanation": "=MÉDIA(B2:B4) soma os valores e divide automaticamente pela quantidade de elementos."
      },
      {
        "id": "d8_q5",
        "question": "O que significa o operador de dois pontos (:) em uma fórmula como =SOMA(B1:B20)?",
        "options": [
          "Significa \"e apenas\" (somente B1 e B20)",
          "Significa \"até\" (um intervalo contínuo de B1 até B20)",
          "Significa divisão dos dois números",
          "Significa multiplicação"
        ],
        "correctIndex": 1,
        "explanation": "O símbolo de dois pontos (:) define um intervalo de células do início até o fim."
      }
    ]
  },
  {
    "day": 9,
    "title": "Dia 9: Nuvem & Rotinas de Backup de Arquivos",
    "subtitle": "Vantagens do armazenamento em nuvem (Drive/OneDrive), sincronização e a regra de ouro 3-2-1.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "A \"Nuvem\" significa que seus arquivos ficam guardados em servidores seguros na internet.",
      "Permite acessar seus documentos, planilhas e fotos a partir de qualquer computador ou celular.",
      "Compartilhamento inteligente: você pode enviar um link com permissão de \"Apenas Ver\" ou \"Pode Editar\".",
      "Backup é a cópia de segurança de dados vitais para evitar perdas com defeitos físicos ou vírus.",
      "A regra 3-2-1 de backup: Tenha 3 cópias dos dados, em 2 mídias diferentes, e 1 cópia fora da sua casa/empresa (na nuvem)."
    ],
    "questions": [
      {
        "id": "d9_q1",
        "question": "O que significa armazenar um arquivo \"na Nuvem\" (Cloud Storage)?",
        "options": [
          "Salvar o arquivo no satélite meteorológico",
          "Guardar o arquivo em servidores remotos conectados à internet, acessíveis de qualquer lugar",
          "Apagar o arquivo do computador para economizar energia solar",
          "Imprimir o arquivo em papel"
        ],
        "correctIndex": 1,
        "explanation": "Armazenamento em nuvem guarda dados em data centers remotos e seguros com sincronização online."
      },
      {
        "id": "d9_q2",
        "question": "São exemplos consagrados de serviços gratuitos de armazenamento em nuvem:",
        "options": [
          "Google Drive e Microsoft OneDrive",
          "Bloco de notas e Calculadora",
          "Paint e Windows Media Player",
          "Placa de vídeo e Fonte"
        ],
        "correctIndex": 0,
        "explanation": "Google Drive, OneDrive, Dropbox e iCloud são as plataformas líderes de armazenamento em nuvem."
      },
      {
        "id": "d9_q3",
        "question": "Ao compartilhar um arquivo da nuvem com um colega, qual permissão evita que ele apague seu conteúdo?",
        "options": [
          "Permissão de Administrador Total",
          "Permissão de Leitor (Apenas Visualizar)",
          "Permissão de Editor",
          "Permissão de Proprietário"
        ],
        "correctIndex": 1,
        "explanation": "O modo \"Leitor\" permite que a pessoa abra e leia o documento sem poder alterar o arquivo original."
      },
      {
        "id": "d9_q4",
        "question": "Qual a recomendação da regra clássica de backup 3-2-1?",
        "options": [
          "Salvar 3 vezes no mesmo pendrive em 2 minutos",
          "3 cópias dos dados importantes, em 2 mídias distintas, com 1 cópia armazenada fora (em nuvem)",
          "Comprar 3 computadores novos a cada 2 anos",
          "Fazer backup apenas nos dias 3, 2 e 1 do mês"
        ],
        "correctIndex": 1,
        "explanation": "A regra 3-2-1 protege contra perdas por falha de hardware, roubo ou desastres locais."
      },
      {
        "id": "d9_q5",
        "question": "Se o seu computador sofrer uma pane física e queimar a placa mãe, o que acontece com os arquivos no Google Drive?",
        "options": [
          "São destruídos junto com o computador",
          "Permanecem 100% seguros na nuvem e podem ser acessados de outro computador ou celular",
          "Ficam indisponíveis para sempre",
          "São impressos automaticamente"
        ],
        "correctIndex": 1,
        "explanation": "Por estarem em servidores remotos, os arquivos na nuvem não sofrem dano com a quebra física da sua máquina."
      }
    ]
  },
  {
    "day": 10,
    "title": "Dia 10: Manutenção Básica & Resolução de Problemas",
    "subtitle": "O poder de reiniciar o sistema, Gerenciador de Tarefas, limpeza e encerramento do curso.",
    "durationSeconds": 120,
    "videoUrl": "",
    "videoType": "youtube",
    "summary": [
      "Reiniciar o computador limpa a memória RAM e finaliza processos travados em segundo plano.",
      "O Gerenciador de Tarefas (Ctrl + Shift + Esc) permite forçar o encerramento de programas que travaram.",
      "A ferramenta \"Limpeza de Disco\" remove arquivos temporários que ocupam espaço desnecessário.",
      "Manter o sistema operacional e antivírus atualizados corrige falhas de segurança.",
      "Parabéns! Completando este último dia e passando no quiz com nota 8+, seu certificado será gerado!"
    ],
    "questions": [
      {
        "id": "d10_q1",
        "question": "Por que o simples ato de \"Reiniciar o Computador\" costuma resolver a maioria das lentidões momentâneas?",
        "options": [
          "Porque ele troca os cabos internos do PC sozinho",
          "Porque esvazia a memória RAM, encerra processos em conflito e recarrega o sistema do zero",
          "Porque instala uma nova internet",
          "Porque resfria o monitor"
        ],
        "correctIndex": 1,
        "explanation": "Reiniciar descarrega resíduos temporários acumulados na RAM e zera os estados de erro."
      },
      {
        "id": "d10_q2",
        "question": "Se um aplicativo travou completamente e não fecha no \"X\", qual ferramenta permite finalizá-lo à força?",
        "options": [
          "Calculadora",
          "Gerenciador de Tarefas (Task Manager)",
          "Painel de Papel de Parede",
          "Relógio do sistema"
        ],
        "correctIndex": 1,
        "explanation": "No Gerenciador de Tarefas (Ctrl+Shift+Esc), você pode selecionar o programa e clicar em \"Finalizar Tarefa\"."
      },
      {
        "id": "d10_q3",
        "question": "Para que serve o utilitário de \"Limpeza de Disco\" nativo do Windows?",
        "options": [
          "Para jogar água dentro do gabinete",
          "Para apagar arquivos temporários de navegação, relatórios de erro e liberar espaço no HD/SSD",
          "Para aumentar o tamanho das fotos",
          "Para mudar o nome do usuário"
        ],
        "correctIndex": 1,
        "explanation": "A Limpeza de Disco deleta caches e arquivos temporários obsoletos com total segurança."
      },
      {
        "id": "d10_q4",
        "question": "Por que é importante instalar as \"Atualizações do Sistema\" (Windows Update)?",
        "options": [
          "Apenas para gastar espaço em disco",
          "Para corrigir falhas de segurança descobertas, melhorar a estabilidade e o desempenho",
          "Para apagar todos os documentos dos usuários",
          "Para desativar a placa de rede"
        ],
        "correctIndex": 1,
        "explanation": "Atualizações fecham brechas de segurança cibernética e otimizam a estabilidade dos drivers."
      },
      {
        "id": "d10_q5",
        "question": "Qual é o cuidado físico essencial com as saídas de ar e ventiladores (coolers) do computador?",
        "options": [
          "Cobrir as saídas de ar com toalhas ou panos grossos",
          "Manter as saídas desobstruídas e livres de poeira para evitar superaquecimento da CPU",
          "Deixar o computador exposto diretamente sob o sol forte",
          "Molhar os ventiladores com água corrente"
        ],
        "correctIndex": 1,
        "explanation": "A circulação de ar adequada previne o superaquecimento do processador e componentes internos."
      }
    ]
  }
];
