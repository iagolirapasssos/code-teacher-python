// Carregar Pyodide e preparar para execução de código Python
let pyodide;

async function loadPyodideAndPackages() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage('micropip');
    console.log('Pyodide is ready');
}

loadPyodideAndPackages();

// Função geral para testar o código do usuário para variáveis
async function processTest(userCode, expectedCode, variableName, expectedValue) {
    try {
        await pyodide.runPythonAsync(userCode);
        const result = pyodide.globals.get(variableName);
        return result === expectedValue && userCode.includes(expectedCode);
    } catch (e) {
        console.error("Test Error:", e);
        return false;
    }
}

// Função geral para testar o código do usuário para funções
async function processFunctionTest(userCode, expectedCode, functionName, expectedOutput) {
    try {
        await pyodide.runPythonAsync(userCode);
        const func = pyodide.globals.get(functionName);
        const result = func();
        return result === expectedOutput && userCode.includes(expectedCode);
    } catch (e) {
        console.error("Function Test Error:", e);
        return false;
    }
}

// Função geral para testar respostas simples
async function processSimpleTest(userCode, expectedCode) {
    return userCode.trim().toLowerCase() === expectedCode.toLowerCase();
}

// Definindo níveis de exemplo
const levels = [
    // Variáveis
    {
        id: 1,
        description: "Declare uma variável chamada 'x' e atribua-lhe o valor 5.",
        code: `x = 5`,
        explanation: "Este código declara uma variável `x` e atribui a ela o valor `5` em Python.",
        test: function (userCode) {
            return processTest(userCode, "x = 5", "x", 5);
        }
    },
    {
        id: 2,
        description: "Declare uma variável chamada 'nome' e atribua a ela o valor 'João'.",
        code: `nome = 'João'`,
        explanation: "Este código declara uma variável `nome` e atribui a ela o valor `'João'`.",
        test: function (userCode) {
            return processTest(userCode, "nome = 'João'", "nome", 'João');
        }
    },

    // Tipos de dados
    {
        id: 3,
        description: "Declare uma variável chamada 'pi' e atribua a ela o valor 3.14.",
        code: `pi = 3.14`,
        explanation: "Este código declara uma variável `pi` e atribui a ela o valor `3.14` em Python.",
        test: function (userCode) {
            return processTest(userCode, "pi = 3.14", "pi", 3.14);
        }
    },
    {
        id: 4,
        description: "Declare uma variável chamada 'status' e atribua a ela o valor booleano True.",
        code: `status = True`,
        explanation: "Este código declara uma variável `status` e atribui a ela o valor booleano `True`.",
        test: function (userCode) {
            return processTest(userCode, "status = True", "status", true);
        }
    },

    // Operadores
    {
        id: 5,
        description: "Declare duas variáveis 'a' e 'b', e atribua a 'a' o valor 10 e a 'b' o valor 5. Em seguida, crie uma variável 'soma' que armazena a soma de 'a' e 'b'.",
        code: `a = 10\nb = 5\nsoma = a + b`,
        explanation: "Este código declara duas variáveis `a` e `b`, e calcula a soma delas, armazenando o resultado na variável `soma`.",
        test: function (userCode) {
            return processTest(userCode, "soma = a + b", "soma", 15);
        }
    },
    {
        id: 6,
        description: "Crie uma variável chamada 'resultado' que armazena o valor de '20' dividido por '4'.",
        code: `resultado = 20 / 4`,
        explanation: "Este código calcula o valor de `20` dividido por `4` e armazena o resultado na variável `resultado`.",
        test: function (userCode) {
            return processTest(userCode, "resultado = 20 / 4", "resultado", 5);
        }
    },

    // Entrada e saída
    {
        id: 7,
        description: "Escreva um programa que peça ao usuário para inserir seu nome e armazene a entrada em uma variável chamada 'nome'. Em seguida, imprima 'Olá, {nome}!'",
        code: `nome = input("Digite seu nome: ")\nprint(f'Olá, {nome}!')`,
        explanation: "Este código solicita ao usuário que insira seu nome e imprime uma mensagem de saudação usando o nome fornecido.",
        test: function (userCode) {
            // Esta função deve ser aprimorada para verificar a interação com o usuário, o que pode ser difícil com Pyodide
            return userCode.includes("input") && userCode.includes("print");
        }
    },
    {
        id: 8,
        description: "Peça ao usuário para inserir um número e imprima o quadrado desse número.",
        code: `numero = int(input("Digite um número: "))\nprint(numero ** 2)`,
        explanation: "Este código solicita ao usuário que insira um número, calcula o quadrado desse número e imprime o resultado.",
        test: function (userCode) {
            // Similar ao anterior, esta função deve ser aprimorada para verificar a interação com o usuário
            return userCode.includes("input") && userCode.includes("print");
        }
    },

    // Estruturas de controle
    {
        id: 9,
        description: "Escreva um código que verifique se um número é positivo ou negativo. O código deve imprimir 'Positivo' se o número for maior que 0, e 'Negativo' se for menor que 0.",
        code: `numero = 5\nif numero > 0:\n    print('Positivo')\nelse:\n    print('Negativo')`,
        explanation: "Este código usa uma estrutura condicional para verificar se um número é positivo ou negativo e imprime a mensagem correspondente.",
        test: function (userCode) {
            // Verificar a presença das palavras-chave 'if', 'else' e a lógica geral
            return userCode.includes("if") && userCode.includes("else") && userCode.includes("print");
        }
    },
    {
        id: 10,
        description: "Crie um loop que imprima os números de 1 a 5.",
        code: `for i in range(1, 6):\n    print(i)`,
        explanation: "Este código usa um loop `for` para imprimir os números de 1 a 5.",
        test: function (userCode) {
            return userCode.includes("for") && userCode.includes("print");
        }
    },

    // Funções
    {
        id: 11,
        description: "Defina uma função chamada 'dobro' que recebe um número como argumento e retorna o dobro desse número.",
        code: `def dobro(x):\n    return x * 2`,
        explanation: "Esta função `dobro` retorna o dobro do número fornecido como argumento.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def dobro(x):", "dobro", 10); // Exemplo com x=5
        }
    },
    {
        id: 12,
        description: "Escreva uma função chamada 'saudacao' que receba um nome e imprima 'Olá, {nome}!'",
        code: `def saudacao(nome):\n    print(f'Olá, {nome}!')`,
        explanation: "Esta função `saudacao` imprime uma mensagem de saudação usando o nome fornecido como argumento.",
        test: function (userCode) {
            return userCode.includes("def saudacao(nome):") && userCode.includes("print");
        }
    },

    // Módulos e pacotes
    {
        id: 13,
        description: "Importe o módulo 'math' e use a função 'sqrt' para calcular a raiz quadrada de 16.",
        code: `import math\nresultado = math.sqrt(16)`,
        explanation: "Este código importa o módulo `math` e usa a função `sqrt` para calcular a raiz quadrada de 16.",
        test: function (userCode) {
            return userCode.includes("import math") && userCode.includes("math.sqrt");
        }
    },
    {
        id: 14,
        description: "Utilize o módulo 'random' para gerar um número aleatório entre 1 e 10.",
        code: `import random\nnumero = random.randint(1, 10)`,
        explanation: "Este código importa o módulo `random` e usa a função `randint` para gerar um número aleatório entre 1 e 10.",
        test: function (userCode) {
            return userCode.includes("import random") && userCode.includes("random.randint");
        }
    },

    // Strings
    {
        id: 15,
        description: "Declare uma string chamada 'mensagem' com o valor 'Olá, Mundo!' e imprima seu comprimento.",
        code: `mensagem = 'Olá, Mundo!'\nprint(len(mensagem))`,
        explanation: "Este código declara uma string `mensagem` e imprime seu comprimento.",
        test: function (userCode) {
            return userCode.includes("len(mensagem)") && userCode.includes("print");
        }
    },
    {
        id: 16,
        description: "Crie uma string chamada 'texto' e converta-a para maiúsculas.",
        code: `texto = 'programar em python'\nprint(texto.upper())`,
        explanation: "Este código declara uma string `texto` e a converte para maiúsculas.",
        test: function (userCode) {
            return userCode.includes("texto.upper()") && userCode.includes("print");
        }
    },

    // Listas
    {
        id: 17,
        description: "Crie uma lista chamada 'numeros' contendo os números 1, 2 e 3. Adicione o número 4 no final da lista.",
        code: `numeros = [1, 2, 3]\nnumeros.append(4)`,
        explanation: "Este código cria uma lista `numeros` com os valores 1, 2 e 3, e adiciona o número 4 ao final da lista.",
        test: function (userCode) {
            return processTest(userCode, "numeros.append(4)", "numeros", [1, 2, 3, 4]);
        }
    },
    {
        id: 18,
        description: "Crie uma lista chamada 'frutas' e acesse o primeiro elemento.",
        code: `frutas = ['maçã', 'banana', 'laranja']\nprint(frutas[0])`,
        explanation: "Este código cria uma lista `frutas` e imprime o primeiro elemento da lista.",
        test: function (userCode) {
            return userCode.includes("frutas[0]") && userCode.includes("print");
        }
    },

    // Tuplas
    {
        id: 19,
        description: "Crie uma tupla chamada 'coordenadas' com os valores (10, 20). Acesse o segundo valor da tupla.",
        code: `coordenadas = (10, 20)\nprint(coordenadas[1])`,
        explanation: "Este código cria uma tupla `coordenadas` com os valores 10 e 20, e imprime o segundo valor da tupla.",
        test: function (userCode) {
            return userCode.includes("coordenadas[1]") && userCode.includes("print");
        }
    },
    {
        id: 20,
        description: "Crie uma tupla chamada 'dados' contendo o nome e a idade de uma pessoa. Desempacote a tupla em duas variáveis, 'nome' e 'idade'.",
        code: `dados = ('Alice', 30)\n(nome, idade) = dados`,
        explanation: "Este código cria uma tupla `dados` e desempacota seus valores nas variáveis `nome` e `idade`.",
        test: function (userCode) {
            return userCode.includes("dados =") && userCode.includes("(nome, idade) = dados");
        }
    },

    // Dicionários
    {
        id: 21,
        description: "Crie um dicionário chamado 'pessoa' com as chaves 'nome' e 'idade', e atribua valores a essas chaves.",
        code: `pessoa = {'nome': 'João', 'idade': 25}`,
        explanation: "Este código cria um dicionário `pessoa` com as chaves `nome` e `idade`, e atribui valores a essas chaves.",
        test: function (userCode) {
            return userCode.includes("{'nome': 'João', 'idade': 25}") && userCode.includes("pessoa =");
        }
    },
    {
        id: 22,
        description: "Adicione um novo par chave-valor ao dicionário 'pessoa', com a chave 'cidade' e o valor 'São Paulo'.",
        code: `pessoa['cidade'] = 'São Paulo'`,
        explanation: "Este código adiciona uma nova chave `cidade` ao dicionário `pessoa`, com o valor `São Paulo`.",
        test: function (userCode) {
            return userCode.includes("pessoa['cidade'] = 'São Paulo'");
        }
    },

    // Arquivos
    {
        id: 23,
        description: "Escreva um programa que crie um arquivo chamado 'texto.txt' e escreva 'Olá, Mundo!' nele.",
        code: `with open('texto.txt', 'w') as f:\n    f.write('Olá, Mundo!')`,
        explanation: "Este código cria um arquivo chamado `texto.txt` e escreve `Olá, Mundo!` no arquivo.",
        test: function (userCode) {
            return userCode.includes("open('texto.txt', 'w')") && userCode.includes("f.write('Olá, Mundo!')");
        }
    },
    {
        id: 24,
        description: "Leia o conteúdo do arquivo 'texto.txt' e imprima-o.",
        code: `with open('texto.txt', 'r') as f:\n    print(f.read())`,
        explanation: "Este código lê o conteúdo do arquivo `texto.txt` e o imprime.",
        test: function (userCode) {
            return userCode.includes("open('texto.txt', 'r')") && userCode.includes("print(f.read())");
        }
    },

    // Exceções
    {
        id: 25,
        description: "Escreva um código que tenta dividir um número por zero e captura a exceção 'ZeroDivisionError'.",
        code: `try:\n    resultado = 1 / 0\nexcept ZeroDivisionError:\n    print('Divisão por zero não permitida.')`,
        explanation: "Este código tenta dividir um número por zero e captura a exceção `ZeroDivisionError`, imprimindo uma mensagem de erro.",
        test: function (userCode) {
            return userCode.includes("ZeroDivisionError") && userCode.includes("print('Divisão por zero não permitida.')");
        }
    },
    {
        id: 26,
        description: "Crie uma função que recebe um número e retorna o inverso. Captura a exceção se o número for zero.",
        code: `def inverso(x):\n    try:\n        return 1 / x\n    except ZeroDivisionError:\n        return 'Não é possível dividir por zero.'`,
        explanation: "Esta função `inverso` tenta retornar o inverso de um número, capturando a exceção `ZeroDivisionError` se o número for zero.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def inverso(x):", "inverso", 2); // Exemplo com x=2
        }
    },

    // Programação Orientada a Objetos (POO)
    {
        id: 27,
        description: "Defina uma classe chamada 'Pessoa' com um construtor que inicializa o nome e a idade. Crie um método que imprima uma saudação.",
        code: `class Pessoa:\n    def __init__(self, nome, idade):\n        self.nome = nome\n        self.idade = idade\n    def saudacao(self):\n        print(f'Olá, meu nome é {self.nome} e tenho {self.idade} anos.')`,
        explanation: "Esta classe `Pessoa` possui um construtor que inicializa `nome` e `idade`, e um método `saudacao` que imprime uma mensagem.",
        test: function (userCode) {
            return userCode.includes("class Pessoa") && userCode.includes("def saudacao");
        }
    },
    {
        id: 28,
        description: "Crie um objeto da classe 'Pessoa' e chame o método de saudação.",
        code: `pessoa = Pessoa('Alice', 30)\npessoa.saudacao()`,
        explanation: "Este código cria um objeto da classe `Pessoa` e chama o método `saudacao`.",
        test: function (userCode) {
            return userCode.includes("pessoa = Pessoa") && userCode.includes("pessoa.saudacao()");
        }
    },

    // Bibliotecas e frameworks comuns
    {
        id: 29,
        description: "Use o módulo 'numpy' para criar um array de números inteiros de 1 a 5.",
        code: `import numpy as np\narray = np.array([1, 2, 3, 4, 5])`,
        explanation: "Este código importa o módulo `numpy` e cria um array de números inteiros de 1 a 5.",
        test: function (userCode) {
            return userCode.includes("import numpy as np") && userCode.includes("np.array([1, 2, 3, 4, 5])");
        }
    },
    {
        id: 30,
        description: "Utilize o 'pandas' para criar um DataFrame com uma coluna 'A' contendo os valores 1, 2 e 3.",
        code: `import pandas as pd\ndf = pd.DataFrame({'A': [1, 2, 3]})`,
        explanation: "Este código importa o módulo `pandas` e cria um DataFrame com uma coluna `A` contendo os valores 1, 2 e 3.",
        test: function (userCode) {
            return userCode.includes("import pandas as pd") && userCode.includes("pd.DataFrame({'A': [1, 2, 3]})");
        }
    },

    // Manipulação de dados
    {
        id: 31,
        description: "Crie um DataFrame com duas colunas 'A' e 'B' e adicione uma nova linha com os valores 10 e 20.",
        code: `import pandas as pd\ndf = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})\ndf.loc[2] = [10, 20]`,
        explanation: "Este código cria um DataFrame com duas colunas e adiciona uma nova linha com os valores 10 e 20.",
        test: function (userCode) {
            return userCode.includes("pd.DataFrame({'A': [1, 2], 'B': [3, 4]})") && userCode.includes("df.loc[2] = [10, 20]");
        }
    },
    {
        id: 32,
        description: "Crie um gráfico de dispersão usando o módulo 'matplotlib' com os dados [1, 2, 3] para o eixo x e [4, 5, 6] para o eixo y.",
        code: `import matplotlib.pyplot as plt\nx = [1, 2, 3]\ny = [4, 5, 6]\nplt.scatter(x, y)\nplt.show()`,
        explanation: "Este código importa o módulo `matplotlib.pyplot` e cria um gráfico de dispersão com os dados fornecidos.",
        test: function (userCode) {
            return userCode.includes("import matplotlib.pyplot as plt") && userCode.includes("plt.scatter(x, y)");
        }
    },

    // Lógica de programação
    {
        id: 33,
        description: "Escreva uma função que recebe uma lista de números e retorna a soma de todos os números pares.",
        code: `def soma_pares(lista):\n    return sum(x for x in lista if x % 2 == 0)`,
        explanation: "Esta função `soma_pares` calcula a soma de todos os números pares em uma lista.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def soma_pares(lista):", "soma_pares", [1, 2, 3, 4, 5, 6]); // Exemplo com lista
        }
    },
    {
        id: 34,
        description: "Crie uma função que determina se um número é primo.",
        code: `def e_primo(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True`,
        explanation: "Esta função `e_primo` verifica se um número é primo.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def e_primo(n):", "e_primo", 7); // Exemplo com n=7
        }
    },

    // Algoritmos e testes automatizados
    {
        id: 35,
        description: "Escreva um algoritmo de ordenação por bolha (bubble sort) que ordena uma lista de números em ordem crescente.",
        code: `def bubble_sort(lista):\n    n = len(lista)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if lista[j] > lista[j+1]:\n                lista[j], lista[j+1] = lista[j+1], lista[j]\n    return lista`,
        explanation: "Este código implementa o algoritmo de ordenação por bolha para ordenar uma lista de números.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def bubble_sort(lista):", "bubble_sort", [3, 1, 4, 1, 5, 9]); // Exemplo com lista desordenada
        }
    },
    {
        id: 36,
        description: "Crie uma função que testa se duas listas são iguais.",
        code: `def listas_iguais(lista1, lista2):\n    return lista1 == lista2`,
        explanation: "Esta função `listas_iguais` verifica se duas listas são iguais.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def listas_iguais(lista1, lista2):", "listas_iguais", [[1, 2, 3], [1, 2, 3]]); // Exemplo com duas listas iguais
        }
    },
        // Algoritmos (continuação)
    {
        id: 37,
        description: "Implemente a busca binária para encontrar um elemento em uma lista ordenada.",
        code: `def busca_binaria(lista, alvo):\n    esquerda, direita = 0, len(lista) - 1\n    while esquerda <= direita:\n        meio = (esquerda + direita) // 2\n        if lista[meio] == alvo:\n            return meio\n        elif lista[meio] < alvo:\n            esquerda = meio + 1\n        else:\n            direita = meio - 1\n    return -1`,
        explanation: "Este código implementa a busca binária para encontrar um elemento em uma lista ordenada. Retorna o índice do elemento ou -1 se não for encontrado.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def busca_binaria(lista, alvo):", "busca_binaria", [[1, 2, 3, 4, 5], 4]); // Exemplo com lista e alvo
        }
    },
    {
        id: 38,
        description: "Crie uma função que encontre o menor e o maior valor em uma lista de números.",
        code: `def min_max(lista):\n    return min(lista), max(lista)`,
        explanation: "Esta função `min_max` retorna o menor e o maior valor de uma lista de números.",
        test: function (userCode) {
            return processFunctionTest(userCode, "def min_max(lista):", "min_max", [1, 5, 3, 9, 2]); // Exemplo com lista de números
        }
    },

    // Testes Automatizados
    {
        id: 39,
        description: "Escreva um teste automatizado para verificar se a função 'soma_pares' está retornando o resultado correto.",
        code: `def teste_soma_pares():\n    assert soma_pares([1, 2, 3, 4]) == 6\n    assert soma_pares([1, 3, 5]) == 0\n    assert soma_pares([]) == 0\n    print('Todos os testes passaram!')`,
        explanation: "Este código define um teste automatizado para a função `soma_pares`, verificando se ela retorna a soma correta dos números pares.",
        test: function (userCode) {
            return userCode.includes("assert soma_pares([1, 2, 3, 4]) == 6") &&
                   userCode.includes("assert soma_pares([1, 3, 5]) == 0") &&
                   userCode.includes("assert soma_pares([]) == 0") &&
                   userCode.includes("print('Todos os testes passaram!')");
        }
    },
    {
        id: 40,
        description: "Escreva um teste automatizado para a função 'e_primo' que verifica se a função está corretamente identificando números primos.",
        code: `def teste_e_primo():\n    assert e_primo(2) == True\n    assert e_primo(4) == False\n    assert e_primo(13) == True\n    assert e_primo(1) == False\n    print('Todos os testes passaram!')`,
        explanation: "Este código define um teste automatizado para a função `e_primo`, verificando se ela identifica corretamente números primos.",
        test: function (userCode) {
            return userCode.includes("assert e_primo(2) == True") &&
                   userCode.includes("assert e_primo(4) == False") &&
                   userCode.includes("assert e_primo(13) == True") &&
                   userCode.includes("assert e_primo(1) == False") &&
                   userCode.includes("print('Todos os testes passaram!')");
        }
    }
];
