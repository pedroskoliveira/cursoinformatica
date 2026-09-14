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
                "id": "d1_p1_q1",
                "question": "O que representam os ícones na área de trabalho do Windows?",
                "options": [
                        "Apenas imagens decorativas sem função prática.",
                        "Figuras que representam pastas, arquivos ou programas.",
                        "Configurações exclusivas de hardware do computador.",
                        "Arquivos corrompidos que devem ser excluídos."
                ],
                "correctIndex": 1,
                "explanation": "Ícones são representações gráficas que facilitam o acesso rápido a pastas, arquivos e programas instalados."
        },
        {
                "id": "d1_p1_q2",
                "question": "Qual é a principal função de um atalho no Windows?",
                "options": [
                        "Apagar permanentemente um programa do disco rígido.",
                        "Reduzir a resolução da tela automaticamente.",
                        "Direcionar para um programa ou pasta rapidamente.",
                        "Compactar arquivos pesados em formato compactado."
                ],
                "correctIndex": 2,
                "explanation": "Atalhos servem como pontes para abrir arquivos, pastas ou programas sem precisar navegar até seu local original de instalação."
        },
        {
                "id": "d1_p1_q3",
                "question": "Como é possível identificar visualmente se um arquivo é um aplicativo (programa)?",
                "options": [
                        "Porque ele obrigatoriamente tem a extensão .txt.",
                        "Porque ele sempre possui o tamanho exato de 1 MB.",
                        "Pelo fato de não possuir ícone gráfico associado.",
                        "Pelo desenho diferenciado apresentado ao lado do nome."
                ],
                "correctIndex": 3,
                "explanation": "Os aplicativos trazem um ícone gráfico exclusivo desenhado pelo desenvolvedor ao lado do seu nome."
        },
        {
                "id": "d1_p1_q4",
                "question": "Quando você cria um atalho para um arquivo ou programa, o que aparece no nome dele?",
                "options": [
                        "A palavra \"Atalho\".",
                        "A palavra \"Cópia\".",
                        "A extensão \".exe\".",
                        "Um ponto de interrogação vermelho."
                ],
                "correctIndex": 0,
                "explanation": "Ao gerar um atalho no Windows, o sistema inclui a palavra \"Atalho\" no nome para diferenciá-lo do arquivo original."
        },
        {
                "id": "d1_p1_q5",
                "question": "Qual das opções de exibição na área de trabalho impede que você sobreponha um ícone em cima de outro?",
                "options": [
                        "Ícones grandes",
                        "Alinhar ícones à grade",
                        "Organizar ícones automaticamente",
                        "Mostrar ícones da área de trabalho"
                ],
                "correctIndex": 1,
                "explanation": "O alinhamento à grade cria divisões invisíveis na tela que impedem que um ícone fique sobreposto a outro."
        },
        {
                "id": "d1_p1_q6",
                "question": "O que acontece quando você seleciona a opção de organizar os ícones automaticamente?",
                "options": [
                        "O Windows apaga arquivos antigos da lixeira.",
                        "Todos os arquivos são movidos para a pasta Documentos.",
                        "O computador se encarrega de organizar os ícones de forma automática.",
                        "O plano de fundo muda para uma paisagem padrão."
                ],
                "correctIndex": 2,
                "explanation": "Com essa opção ativa, o próprio sistema organiza e empilha os ícones automaticamente em colunas na tela."
        },
        {
                "id": "d1_p1_q7",
                "question": "É possível alterar o tamanho dos ícones exibidos na área de trabalho?",
                "options": [
                        "Não, o tamanho é fixo pelo sistema operacional.",
                        "Sim, apenas por meio do Painel de Controle avançado.",
                        "Sim, apertando a tecla F5 repetidamente.",
                        "Sim, clicando com o botão direito na área de trabalho e escolhendo \"Exibir\" (ícones grandes, médios ou pequenos)."
                ],
                "correctIndex": 3,
                "explanation": "No menu de contexto da área de trabalho (botão direito > Exibir), é possível escolher entre ícones grandes, médios ou pequenos."
        },
        {
                "id": "d1_p1_q8",
                "question": "Qual comando rápido do teclado ou do mouse permite copiar um arquivo arrastando-o para a área de trabalho?",
                "options": [
                        "Clicar com o botão direito e escolher \"Criar atalho\" ou colar o arquivo copiado.",
                        "Apertar Ctrl + Alt + Delete.",
                        "Dar um clique duplo no fundo da tela.",
                        "Pressionar a tecla Esc três vezes."
                ],
                "correctIndex": 0,
                "explanation": "Pode-se copiar o arquivo e colar na área de trabalho ou clicar com o botão direito e selecionar \"Criar atalho\"."
        },
        {
                "id": "d1_p1_q9",
                "question": "No procedimento alternativo para criar um atalho, qual botão da caixa de diálogo é clicado para localizar a pasta ou programa?",
                "options": [
                        "Salvar",
                        "Procurar",
                        "Avançar",
                        "Concluir"
                ],
                "correctIndex": 1,
                "explanation": "Ao clicar em \"Procurar\", abre-se a janela de navegação para selecionar o arquivo ou pasta de destino do atalho."
        },
        {
                "id": "d1_p1_q10",
                "question": "Qual é uma das vantagens citadas no vídeo sobre o alinhamento de ícones à grade?",
                "options": [
                        "Aumentar a velocidade de processamento do computador.",
                        "Proteger o sistema contra vírus de pen drive.",
                        "Deixar os ícones alinhados sem permitir sobreposição indesejada.",
                        "Economizar espaço físico no HD."
                ],
                "correctIndex": 2,
                "explanation": "O alinhamento à grade mantém a área de trabalho visualmente organizada e impede que ícones fiquem sobrepostos."
        },
        {
                "id": "d1_p2_q1",
                "question": "Por que as opções de \"Bateria\" e \"Armazenamento\" são consideradas muito importantes no Windows atual?",
                "options": [
                        "Porque elas impedem que o computador seja desligado à força.",
                        "Porque substituem totalmente a necessidade de antivírus.",
                        "Porque garantem conexão de internet de alta velocidade.",
                        "Porque a maioria das pessoas utiliza notebooks, tornando o gerenciamento de energia e espaço essencial no dia a dia."
                ],
                "correctIndex": 3,
                "explanation": "Com a predominância de notebooks, monitorar a duração da bateria e a capacidade do disco é crucial para a rotina de trabalho e estudo."
        },
        {
                "id": "d1_p2_q2",
                "question": "Qual configuração simples em \"Vídeo\" pode ajudar a economizar a bateria de um notebook?",
                "options": [
                        "Modificar o brilho da tela.",
                        "Desinstalar o navegador de internet.",
                        "Alterar o idioma do teclado para inglês.",
                        "Limpar o histórico da lixeira."
                ],
                "correctIndex": 0,
                "explanation": "A tela é um dos componentes que mais consome energia; reduzir o brilho prolonga expressivamente a duração da bateria."
        },
        {
                "id": "d1_p2_q3",
                "question": "O que acontece quando a economia de bateria é ativada automaticamente ao atingir um nível configurado (ex: 30% ou 5% por padrão)?",
                "options": [
                        "O computador desliga instantaneamente para proteger os dados.",
                        "O sistema tenta economizar energia da bateria limitando atividades em segundo plano e ajustando desempenho para aumentar a vida útil.",
                        "A tela fica completamente preta de forma irreversível.",
                        "Todos os arquivos temporários são deletados no mesmo segundo."
                ],
                "correctIndex": 1,
                "explanation": "O modo economia limita processos em segundo plano, diminui animações e reduz o consumo para estender o tempo de uso."
        },
        {
                "id": "d1_p2_q4",
                "question": "Por que o padrão de fábrica do Windows costuma vir configurado para ativar a economia de bateria em 5%?",
                "options": [
                        "Porque 5% é o limite máximo que a bateria suporta sem explodir.",
                        "Porque impede o funcionamento de jogos pesados.",
                        "Porque a maioria das pessoas costuma usar o notebook com o cabo carregador conectado por perto.",
                        "Porque acelera a inicialização do Windows em 50%."
                ],
                "correctIndex": 2,
                "explanation": "Os fabricantes pressupõem que o usuário utilize o notebook próximo à tomada, mas é recomendável ajustar para 20% ou 30%."
        },
        {
                "id": "d1_p2_q5",
                "question": "O que a tela de \"Armazenamento\" exibe em relação à unidade principal (ex: Disco C:)?",
                "options": [
                        "Apenas a temperatura atual do processador.",
                        "A marca e o modelo exato da placa de vídeo.",
                        "A quantidade de memória RAM instalada na placa-mãe.",
                        "O tamanho total em gigabytes ou terabytes, quanto espaço já foi usado e quanto espaço está livre."
                ],
                "correctIndex": 3,
                "explanation": "A tela de armazenamento apresenta graficamente o espaço total do disco, a quantidade em uso e o espaço livre restante."
        },
        {
                "id": "d1_p2_q6",
                "question": "Por que é importante monitorar o espaço livre no armazenamento do computador?",
                "options": [
                        "Porque quanto mais cheio o computador estiver (espaço utilizado excessivamente), mais ele poderá demorar para encontrar arquivos e executar programas.",
                        "Porque o computador pode se autodestruir se atingir 100%.",
                        "Porque o teclado trava permanentemente se faltar espaço.",
                        "Para evitar que a cor da barra de tarefas mude para vermelho."
                ],
                "correctIndex": 0,
                "explanation": "Discos muito cheios prejudicam o desempenho geral do sistema operacional, memória virtual e a velocidade de abertura de programas."
        },
        {
                "id": "d1_p2_q7",
                "question": "O que o Windows detalha na parte inferior da aba de armazenamento?",
                "options": [
                        "O consumo exato de energia elétrica em watts na tomada.",
                        "Com o que você está gastando memória e espaço (como arquivos temporários, aplicativos, documentos, etc.).",
                        "A lista de todas as senhas salvas no navegador.",
                        "Os sites mais acessados nos últimos 30 dias."
                ],
                "correctIndex": 1,
                "explanation": "O Windows discrimina os gigabytes ocupados por aplicativos instalados, arquivos temporários, documentos, vídeos e sistema."
        },
        {
                "id": "d1_p2_q8",
                "question": "Quais tipos de arquivos temporários comuns o Windows ajuda a remover para liberar espaço?",
                "options": [
                        "Fotos pessoais e vídeos salvos na pasta Documentos.",
                        "Arquivos essenciais do sistema operacional indispensáveis para o boot.",
                        "A lixeira, arquivos de downloads antigos e dados de atualizações do Windows Update.",
                        "Atalhos criados na área de trabalho."
                ],
                "correctIndex": 2,
                "explanation": "A ferramenta de limpeza ajuda a descartar com segurança lixo eletrônico, downloads antigos, miniaturas e restos de atualizações."
        },
        {
                "id": "d1_p2_q9",
                "question": "Qual é a vantagem de apagar arquivos temporários ou esvaziar a lixeira através dessa ferramenta?",
                "options": [
                        "Dobrar a capacidade física do disco rígido.",
                        "Desinstalar vírus automaticamente.",
                        "Atualizar o Windows para a versão mais recente da Microsoft.",
                        "Liberar uma quantidade significativa de gigabytes (espaço de armazenamento) de forma rápida e segura."
                ],
                "correctIndex": 3,
                "explanation": "Permite recuperar gigabytes de espaço em disco sem risco de deletar arquivos pessoais essenciais."
        },
        {
                "id": "d1_p2_q10",
                "question": "Com que frequência o instrutor recomenda verificar ou dar uma olhada na aba de armazenamento?",
                "options": [
                        "De vez em quando, especialmente conforme o tempo passa e acumulamos vídeos, aplicativos e jogos.",
                        "Estritamente a cada 24 horas, sem exceção.",
                        "Apenas quando o computador parar de ligar.",
                        "Nunca, pois o Windows gerencia tudo sozinho sem precisar de atenção."
                ],
                "correctIndex": 0,
                "explanation": "Revisões periódicas evitam que o disco lote silenciosamente e degrade a velocidade do computador."
        },
        {
                "id": "d1_p3_q1",
                "question": "O que significa a palavra \"Windows\" e qual é o papel desse sistema operacional?",
                "options": [
                        "Significa \"Portas\" e serve exclusivamente para conectar à internet.",
                        "Significa \"Janelas\" e é o sistema operacional mais famoso e utilizado.",
                        "Significa \"Páginas\" e é um editor de texto avançado.",
                        "Significa \"Ferramentas\" e é um antivírus nativo."
                ],
                "correctIndex": 1,
                "explanation": "Windows significa \"janelas\" em inglês, nome dado devido à sua interface gráfica revolucionária baseada em janelas."
        },
        {
                "id": "d1_p3_q2",
                "question": "O que aparece na tela do computador logo após a inicialização do Windows?",
                "options": [
                        "Apenas a tela preta com o prompt de comando de texto.",
                        "Automaticamente o programa Microsoft Word aberto.",
                        "Uma imagem de fundo, ícones e a barra de tarefas.",
                        "Um assistente de voz para cadastro de usuário."
                ],
                "correctIndex": 2,
                "explanation": "Após o boot, o usuário é recepcionado pela Área de Trabalho (Desktop), contendo papel de parede, ícones e a barra de tarefas."
        },
        {
                "id": "d1_p3_q3",
                "question": "O que são os ícones dispostos na área de trabalho?",
                "options": [
                        "Vídeos em alta definição reproduzidos em segundo plano.",
                        "Erros de sistema gerados por falta de atualização.",
                        "Links temporários da internet.",
                        "Atalhos e representações de pastas, arquivos ou programas para acesso rápido."
                ],
                "correctIndex": 3,
                "explanation": "Ícones servem como representações gráficas interativas para acionar recursos, arquivos ou programas."
        },
        {
                "id": "d1_p3_q4",
                "question": "O que acontece quando você dá dois cliques em cima de uma pasta na área de trabalho?",
                "options": [
                        "O Windows abre essa pasta para você visualizar seu conteúdo.",
                        "A pasta é apagada permanentemente.",
                        "O computador reinicia automaticamente.",
                        "O arquivo é enviado por e-mail."
                ],
                "correctIndex": 0,
                "explanation": "O duplo clique abre a pasta em uma nova janela do Explorador de Arquivos para exibir os itens guardados nela."
        },
        {
                "id": "d1_p3_q5",
                "question": "O que contém no \"Menu Iniciar\" localizado na barra de tarefas?",
                "options": [
                        "Exclusivamente as configurações de rede Wi-Fi.",
                        "Uma série de opções e aplicativos organizados no lado esquerdo que podem ser abertos a qualquer momento.",
                        "O histórico de navegação da lixeira.",
                        "Ferramentas para formatação de disco rígido."
                ],
                "correctIndex": 1,
                "explanation": "O Menu Iniciar é o ponto de partida principal do Windows, reunindo a lista de todos os aplicativos instalados e configurações."
        },
        {
                "id": "d1_p3_q6",
                "question": "Qual é a utilidade da \"Barra de Pesquisa\" no Windows?",
                "options": [
                        "Traduzir textos do inglês para o português em tempo real.",
                        "Fazer pesquisas diretas no dicionário Aurélio offline.",
                        "Permitir digitar o nome de aplicativos, pastas ou arquivos para o Windows localizá-los rapidamente.",
                        "Controlar o volume do som do computador."
                ],
                "correctIndex": 2,
                "explanation": "A barra de pesquisa localiza instantaneamente programas, arquivos, pastas e configurações do sistema pelo nome."
        },
        {
                "id": "d1_p3_q7",
                "question": "Qual é a diferença visual básica entre um atalho e um programa aberto na barra de tarefas?",
                "options": [
                        "Os atalhos mudam de cor para vermelho quando abertos.",
                        "Os programas abertos piscam na tela incansavelmente.",
                        "Não há nenhuma diferença visual.",
                        "Os programas abertos ficam com um indicativo visual (como uma pequena barra colorida, ex: verde ou azul) embaixo deles na barra de tarefas."
                ],
                "correctIndex": 3,
                "explanation": "Programas em execução recebem uma barrinha ou realce embaixo de seu ícone na barra de tarefas, indicando que a janela está ativa."
        },
        {
                "id": "d1_p3_q8",
                "question": "Como você pode fixar um programa favorito na barra de tarefas?",
                "options": [
                        "Clicando com o botão direito no ícone do programa e selecionando \"Fixar na barra de tarefas\".",
                        "Pressionando as teclas Ctrl + F na área de trabalho.",
                        "Arrastando o ícone para dentro da lixeira.",
                        "Desligando o computador e religando com o Shift pressionado."
                ],
                "correctIndex": 0,
                "explanation": "Ao clicar com o botão direito sobre o programa no menu ou na barra, escolhe-se \"Fixar na barra de tarefas\" para deixá-lo sempre acessível."
        },
        {
                "id": "d1_p3_q9",
                "question": "O que é possível encontrar e gerenciar na \"Área de Notificação\" (canto inferior direito)?",
                "options": [
                        "Atalhos para criar novas pastas no disco local C:.",
                        "Relógio, calendário, controle de volume, status da conexão de internet (Wi-Fi) e avisos do sistema.",
                        "Opções avançadas de programação em linguagem Python.",
                        "O instalador oficial do Pacote Office."
                ],
                "correctIndex": 1,
                "explanation": "A Área de Notificação reúne ícones de status vitais: relógio, calendário, rede, áudio, bateria e alertas."
        },
        {
                "id": "d1_p3_q10",
                "question": "Nos Windows mais recentes, o que a caixa/painel de notificação exibe ao ser acionada?",
                "options": [
                        "A lista de todos os vírus detectados no último ano.",
                        "O saldo da conta bancária vinculada ao Windows.",
                        "Avisos do sistema e atalhos rápidos úteis, como modo avião e brilho ou luz noturna.",
                        "Vídeos tutoriais em streaming."
                ],
                "correctIndex": 2,
                "explanation": "A central exibe alertas recentes e atalhos de ação rápida (Wi-Fi, Bluetooth, brilho, modo noturno, etc.)."
        },
        {
                "id": "d1_p4_q1",
                "question": "Quais são os três principais mecanismos utilizados para dar comandos ao computador no Windows?",
                "options": [
                        "Impressora, Monitor e Scanner.",
                        "Microfone, Caixa de som e WebCam.",
                        "Pen Drive, CD-ROM e Cabo HDMI.",
                        "Mouse, TouchPad e Teclado."
                ],
                "correctIndex": 3,
                "explanation": "Mouse, touchpad e teclado são os periféricos de entrada universais para interagir com o computador."
        },
        {
                "id": "d1_p4_q2",
                "question": "O que acontece se você clicar apenas uma vez com o botão esquerdo do mouse em cima de um ícone?",
                "options": [
                        "O ícone é apenas selecionado.",
                        "O programa abre imediatamente em tela cheia.",
                        "O arquivo é enviado para a lixeira.",
                        "O computador executa uma varredura de vírus."
                ],
                "correctIndex": 0,
                "explanation": "Um clique único com o botão esquerdo apenas seleciona/marca o item, sem executá-lo."
        },
        {
                "id": "d1_p4_q3",
                "question": "O que acontece quando você dá dois cliques rápidos com o botão esquerdo do mouse em cima de um programa ou arquivo executável?",
                "options": [
                        "O arquivo é renomeado automaticamente para \"Novo\".",
                        "O programa ou arquivo é aberto.",
                        "O Windows abre as propriedades avançadas de segurança.",
                        "Nada acontece até que se aperte Enter."
                ],
                "correctIndex": 1,
                "explanation": "O duplo clique rápido com o botão esquerdo é o comando padrão do Windows para abrir ou executar um arquivo/programa."
        },
        {
                "id": "d1_p4_q4",
                "question": "Para que serve a ação de \"clicar uma vez com o botão esquerdo e segurar, arrastando em seguida\" na área de trabalho ou pastas?",
                "options": [
                        "Fechar todas as janelas abertas instantaneamente.",
                        "Formatar o disco rígido principal.",
                        "Criar um retângulo transparente para selecionar vários arquivos/ícones ao mesmo tempo.",
                        "Mudar a cor de fundo do monitor."
                ],
                "correctIndex": 2,
                "explanation": "Arrastar com o botão esquerdo pressionado desenha uma caixa de seleção que engloba múltiplos arquivos e pastas."
        },
        {
                "id": "d1_p4_q5",
                "question": "O que sempre é aberto ao clicar com o botão direito do mouse em cima de um ícone ou na área de trabalho?",
                "options": [
                        "Um documento de texto em branco.",
                        "O navegador de internet padrão.",
                        "O painel de ajuda técnica da Microsoft.",
                        "Uma caixa de opções (menu de contexto) com comandos relevantes para aquele item."
                ],
                "correctIndex": 3,
                "explanation": "O botão direito sempre aciona o menu de contexto, exibindo ações específicas como Copiar, Renomear, Excluir e Propriedades."
        },
        {
                "id": "d1_p4_q6",
                "question": "Por que as opções que aparecem ao clicar com o botão direito variam dependendo se você clica em uma pasta, num atalho ou num aplicativo?",
                "options": [
                        "Porque são objetos e itens diferentes com funcionalidades e comandos específicos para cada tipo.",
                        "Porque o mouse apresenta defeito aleatório de clique.",
                        "Porque o Windows altera o menu de forma puramente estética sem motivo prático.",
                        "Porque depende da quantidade de memória RAM livre."
                ],
                "correctIndex": 0,
                "explanation": "O menu é contextual: adapta suas opções de acordo com a natureza e os recursos suportados pelo elemento selecionado."
        },
        {
                "id": "d1_p4_q7",
                "question": "Quais ações comuns de gerenciamento podem ser encontradas no menu do botão direito sobre um arquivo?",
                "options": [
                        "Instalar driver de vídeo e atualizar a BIOS.",
                        "Excluir, Renomear, Criar atalho e Propriedades.",
                        "Aumentar a velocidade da CPU e fazer overclock.",
                        "Configurar resolução 4K e taxa de atualização do monitor."
                ],
                "correctIndex": 1,
                "explanation": "Essas são as ações fundamentais de manipulação de arquivos no sistema operacional."
        },
        {
                "id": "d1_p4_q8",
                "question": "Para que serve a barra de rolagem (rodinha ou scroll) do mouse na área de trabalho?",
                "options": [
                        "Serve exclusivamente para ajustar o volume do som do computador.",
                        "Desliga o computador quando rolada rapidamente.",
                        "Se mantiver a tecla Ctrl pressionada e rolar para cima ou para baixo, ela aumenta ou diminui o tamanho dos ícones.",
                        "Altera o plano de fundo da tela de bloqueio."
                ],
                "correctIndex": 2,
                "explanation": "A combinação Ctrl + scroll do mouse na Área de Trabalho faz zoom dinâmico, redimensionando os ícones instantaneamente."
        },
        {
                "id": "d1_p4_q9",
                "question": "Qual é a utilidade da barra de rolagem do mouse quando você está navegando dentro de um documento longo (como no Word) ou pasta?",
                "options": [
                        "Salvar o arquivo automaticamente a cada linha escrita.",
                        "Corrigir erros ortográficos do texto.",
                        "Mudar a orientação da página de retrato para paisagem.",
                        "Permitir descer ou subir no documento ou na pasta de forma rápida e prática."
                ],
                "correctIndex": 3,
                "explanation": "A rodinha de rolagem permite deslocar a visualização para cima ou para baixo com facilidade sem precisar arrastar a barra lateral."
        },
        {
                "id": "d1_p4_q10",
                "question": "Comparando o mouse convencional com o TouchPad, o que o instrutor comenta no vídeo?",
                "options": [
                        "O mouse é geralmente mais ágil de se utilizar do que o TouchPad.",
                        "O TouchPad é totalmente proibido em sistemas operacionais Windows.",
                        "Não existe nenhuma diferença de usabilidade entre eles.",
                        "O TouchPad possui três botões mecânicos separados obrigatórios."
                ],
                "correctIndex": 0,
                "explanation": "Embora o touchpad seja integrado e portátil, o mouse tradicional oferece maior velocidade e precisão no uso contínuo."
        },
        {
                "id": "d1_p5_q1",
                "question": "Qual é a principal função da tecla \"Caps Lock\" (ou Fixa) no teclado?",
                "options": [
                        "Inserir um espaço duplo entre as palavras.",
                        "Travar a digitação para que todas as letras digitadas fiquem em maiúsculo.",
                        "Apagar o texto inteiro da página atual.",
                        "Abrir o menu iniciar do Windows."
                ],
                "correctIndex": 1,
                "explanation": "Quando acionada, a tecla Caps Lock mantém todas as letras seguintes em maiúsculas até ser desativada."
        },
        {
                "id": "d1_p5_q2",
                "question": "Por que o instrutor não recomenda o uso prolongado da tecla Caps Lock para digitar palavras maiúsculas?",
                "options": [
                        "Porque ela estraga o teclado fisicamente após 10 cliques.",
                        "Porque ela desliga o monitor automaticamente.",
                        "Porque se precisar mudar para minúsculo depois, o Word não oferece opção simples de correção nas fontes, sendo mais prático usar o Shift ou formatação de fonte.",
                        "Porque ela bloqueia o acesso à internet."
                ],
                "correctIndex": 2,
                "explanation": "Usar o Shift para maiúsculas pontuais é mais eficiente e evita erros acidentais de formatação no texto."
        },
        {
                "id": "d1_p5_q3",
                "question": "Como funciona o comportamento da tecla \"Shift\" ao digitar?",
                "options": [
                        "Ela trava permanentemente o teclado em maiúsculo até ser desligada.",
                        "Ela serve apenas para apagar caracteres para frente.",
                        "Ela fecha o programa atual em execução.",
                        "Mantendo o Shift pressionado enquanto digita uma letra, ela sai em maiúsculo; ao soltar, as próximas letras voltam a ser minúsculas."
                ],
                "correctIndex": 3,
                "explanation": "O Shift atua como modificador temporário: maiúsculo enquanto pressionado e minúsculo logo que liberado."
        },
        {
                "id": "d1_p5_q4",
                "question": "O que o Shift faz quando é pressionado junto com uma tecla numérica (ex: Shift + 1, Shift + 2, Shift + 3)?",
                "options": [
                        "Habilita a escrita dos símbolos localizados na parte superior da tecla (como !, @, #).",
                        "Multiplica o número digitado por 10.",
                        "Insere uma quebra de página no documento.",
                        "Apaga o número digitado imediatamente."
                ],
                "correctIndex": 0,
                "explanation": "O Shift aciona a função secundária da tecla, permitindo digitar símbolos superiores como ponto de exclamação, arroba e cerquilha."
        },
        {
                "id": "d1_p5_q5",
                "question": "Para que serve comumente a tecla \"Esc\" (Escape)?",
                "options": [
                        "Salvar o arquivo em formato PDF na área de trabalho.",
                        "Sair de um lugar, cancelar uma ação ou fechar uma janela/diálogo que você não quer mais trabalhar.",
                        "Inserir uma tabela formatada no Word.",
                        "Desconectar o computador da rede elétrica."
                ],
                "correctIndex": 1,
                "explanation": "A tecla Esc é o atalho universal de cancelamento, fechando janelas modais, menus suspensos ou operações em andamento."
        },
        {
                "id": "d1_p5_q6",
                "question": "Qual é a função da tecla \"Tab\" ao ser pressionada em editores de texto como o Word?",
                "options": [
                        "Mudar a cor da fonte para vermelho.",
                        "Inserir um gráfico estatístico completo.",
                        "Inserir uma tabulação (espaçamento padrão, geralmente de 1,25 cm) para avançar o parágrafo.",
                        "Executar a impressão imediata do documento."
                ],
                "correctIndex": 2,
                "explanation": "O Tab cria o recuo de primeira linha oficial de parágrafos de forma alinhada e padronizada."
        },
        {
                "id": "d1_p5_q7",
                "question": "Qual é a diferença de ação entre a tecla \"Backspace\" e a tecla \"Delete\"?",
                "options": [
                        "O Backspace apaga arquivos permanentes; o Delete apenas minimiza programas.",
                        "Não há nenhuma diferença entre ambas nos teclados modernos.",
                        "O Backspace serve para colar textos copiados.",
                        "O Backspace apaga o que está para trás (à esquerda do cursor); o Delete apaga o que está para frente (à direita do cursor)."
                ],
                "correctIndex": 3,
                "explanation": "O Backspace apaga o caractere à esquerda do cursor, enquanto o Delete apaga o caractere situado à direita do cursor."
        },
        {
                "id": "d1_p5_q8",
                "question": "O que acontece quando você pressiona a tecla \"Ctrl\" combinada com outras letras (como Ctrl + C, Ctrl + V, Ctrl + X)?",
                "options": [
                        "Executa atalhos fundamentais de edição: Copiar (C), Colar (V) e Recortar (X).",
                        "Desliga o computador em segurança.",
                        "Abre o gerenciador de tarefas avançado do Windows.",
                        "Formata o texto em negrito e itálico simultaneamente."
                ],
                "correctIndex": 0,
                "explanation": "A tecla Ctrl (Control) combinada com letras ativa os atalhos clássicos de edição e produtividade."
        },
        {
                "id": "d1_p5_q9",
                "question": "Qual é a utilidade da tecla \"Alt Gr\" em teclados brasileiros?",
                "options": [
                        "Alternar entre letras maiúsculas e minúsculas permanentemente.",
                        "Habilitar símbolos e caracteres especiais localizados no canto inferior direito das teclas (como símbolos de expoente ², ³, o símbolo de graus °, ou cifras monetárias).",
                        "Aumentar o volume do computador.",
                        "Fechar aplicativos travados."
                ],
                "correctIndex": 1,
                "explanation": "O Alt Gr (Alternate Graphic) aciona a terceira função de uma tecla, como o símbolo de grau (º), expoentes (² e ³) ou ordinal (ª)."
        },
        {
                "id": "d1_p5_q10",
                "question": "O que ocorre se você pressionar a tecla \"Num Lock\" no teclado numérico lateral e os números não aparecerem na tela?",
                "options": [
                        "O teclado está queimado e precisa ser substituído.",
                        "O Windows travou por falta de memória RAM.",
                        "A tecla Num Lock pode estar desativada/desligada; pressioná-la habilita o uso dos números do teclado numérico lateral.",
                        "O cursor do mouse foi bloqueado pelo sistema."
                ],
                "correctIndex": 2,
                "explanation": "A tecla Num Lock liga e desliga o teclado numérico lateral; quando desligada, as teclas atuam como setas de navegação."
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
