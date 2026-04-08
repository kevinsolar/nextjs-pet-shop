# Guia de Estudo: Formulário de Agendamento no Pet Shop

Este resumo explica, passo a passo, o que foi feito e **por que** foi feito de cada jeito. Ideal para quem está estudando Next.js e ecossistema React.

---

## O que foi construído

Um **formulário de agendamento** que abre dentro de um modal (janela pop-up). O formulário tem 4 campos:

| Campo | O quê |
|---|---|
| Nome do tutor | Quem está agendando |
| Nome do pet | Nome do animal |
| Telefone | Com formatação automática `(00) 0000-0000` |
| Descrição | Texto livre sobre o motivo do agendamento |

Quando o usuário preenche e clica em salvar, os dados são validados automaticamente. Se algo estiver errado (campo vazio, telefone mal formatado), uma mensagem de erro aparece abaixo do campo.

---

## Ferramentas usadas — O que cada uma faz e por quê

### 1. Zod — Validação de dados

O Zod serve para definir **regras** que os dados precisam seguir.

```
// Exemplo conceitual:
"nome do tutor" → obrigatório, mínimo 3 caracteres
"telefone" → obrigatório, formato específico
```

**Por que usar?** Sem o Zod, você teria que escrever `if (nome === "") ...` manualmente para cada campo. Com o Zod, você declara as regras uma vez e ele gera as mensagens de erro sozinho.

### 2. react-hook-form — Gerenciamento de formulário

Sem essa biblioteca, cada input precisaria de um `useState` separado. Num formulário com 4 campos, seriam 4 states, 4 handlers de `onChange`, tudo manualmente.

O `react-hook-form` cuida de tudo: registra os campos, controla o estado, valida e entrega os dados prontos na submissão. E é performático — só re-renderiza o campo que mudou.

### 3. @hookform/resolvers — O tradutor

O `react-hook-form` não entende Zod nativamente. Essa biblioteca é a **ponte** entre os dois: pega as regras do Zod e as transforma em validações que o `react-hook-form` sabe usar.

### 4. react-imask — Máscara de input

Transforma o que o usuário digita em um formato bonito. O usuário digita `11999998888` e aparece `(11) 99999-8888` automaticamente.

### 5. shadcn/ui — Componentes prontos

Em vez de criar inputs, botões e modais do zero (com CSS e acessibilidade manual), usamos componentes prontos da **shadcn/ui**. Eles são construídos sobre **Radix UI** (que garante acessibilidade) e estilizados com **Tailwind CSS**.

Componentes usados:
- **Dialog** — O modal/pop-up onde o formulário aparece
- **Form** — Wrappers que conectam inputs ao `react-hook-form` (`FormField`, `FormItem`, `FormMessage`, etc.)
- **Input** — Campo de texto estilizado
- **Textarea** — Campo de texto grande (para a descrição)
- **Button** — Botão com variantes customizadas (`brand`, `edit`, `remove`)
- **Label** — Rótulo acessível para os campos

### 6. lucide-react — Ícones

Biblioteca de ícones. Adicionamos um ícone de pessoa (`User`) no campo do tutor, um cachorro (`Dog`) no campo do pet e um telefone (`Phone`) no campo de telefone. Isso melhora a experiência visual.

---

## Estrutura de arquivos

```
src/
├── app/
│   └── page.tsx                    ← Página principal, importa o formulário
└── components/
    └── appointment-form/
        ├── form.tsx                ← Formulário completo (schema, inputs, submissão)
        └── index.ts                ← Barrel export (permite importar sem saber o caminho interno)
```

O **barrel export** (`index.ts`) é um conceito útil: em vez de importar `from "@/components/appointment-form/form"`, você importa `from "@/components/appointment-form"`. Se o arquivo interno mudar de nome, quem importa não precisa mudar nada.

---

## Como as peças se conectam

1. O usuário clica em **"Novo Agendamento"** na página principal
2. O **Dialog** (modal) abre
3. O **react-hook-form** registra os 4 campos e conecta ao **Zod** via **resolvers**
4. O usuário digita — o **react-imask** formata o telefone em tempo real
5. Ao clicar em salvar, o **Zod** valida tudo:
   - Se algo falha → mensagem de erro aparece no campo (via `FormMessage`)
   - Se tudo passa → a função `onSubmit` recebe os dados prontos e tipados
6. No momento, `onSubmit` apenas faz `console.log` — a lógica real de salvar ainda será implementada

---

## O que ainda falta

- Lógica real de submissão (enviar os dados para um backend, banco de dados, etc.)
- Os campos de data/hora e seleção de serviço (se fizer parte do escopo)
- Feedback visual de sucesso após o agendamento ser criado

---

## Glossário rápido

| Termo | Significado |
|---|---|
| **Schema** | Conjunto de regras que os dados devem seguir |
| **Resolver** | Tradutor entre duas bibliotecas |
| **Máscara** | Formatação automática aplicada enquanto o usuário digita |
| **Dialog/Modal** | Janela sobreposta que bloqueia o fundo |
| **Barrel export** | Arquivo `index.ts` que re-exporta outros módulos |
| **Variant (Tailwind)** | Versões diferentes de um mesmo componente (ex: botão primário, botão de edição) |
| **Wrapper** | Componente que "embrulha" outro para adicionar comportamento ou estilo |
