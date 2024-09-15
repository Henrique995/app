const { select, input, checkbox } = require('@inquirer/prompts');
const { assert } = require('console');
const fs = require("fs").promises

let mensagem = "Bem vindo ao App de Metas";

let meta = {
    value: 'Tomar 3L de agua por dia',
    checked: false,
}

let metas = [ meta ]

const carregarMetas = async() => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch{erro}
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json",JSON.stringify(metas, null, 2))
}


const cadastrarMeta = async () => {
    const meta = await input({ mensagem: "Digite a meta:"})

    if(meta.length == 0) {
        mensagem = 'A meta não poder ser vazia.'
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = 'Meta(s) marcadas como concluidas(s)'

}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "Não existem metas concluidas!"
        return
    }

    await select({
        message: "Metas realizadas" + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0) {
        mensagem = "Não exstem metas abertas :)"
        return
    }

    await select({
        message: "Metas Abertas" + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    const metasDesmarcadas =  metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itensADeletar = await checkbox({
        message: "Use o espaço para deletar o item que desejar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0) {
        mensagem = "Nenhum iten selecionado"
        return
    }

    itensADeletar.forEach((item) => {
        metas.filter(() => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select ({
            mensagem: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })


        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                mensagem = metas
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "delettar":
                await deletarMetas()
                break
            case "sair":
                mensagem = "Até a próxima!"
                return
        }
    }
} 

start()