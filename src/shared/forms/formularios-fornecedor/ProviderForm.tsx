import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form } from "@unform/web";
import { VTextField } from "../forms-components/VTextField";
import * as Yup from "yup";
import { useVForm } from "../forms-components/UseVForm";
import { IInfoProvider, ProviderService } from "../../services/api/providers/ProviderService";
import "./styles.css"

export interface IProviderCadastroInfo {
    code: number
    name: string
    cnpj: string

    contact: number
    email: string
    telephone: number
    cell: number

    cep:number
    address: string
    cityId?: string
    city: string
    uf: string
    neighborhood: string
    number: number
}

export const ProviderCadastroSchema: Yup.SchemaOf<IProviderCadastroInfo> = Yup.object().shape({
    code: Yup.number().required("O id é obrigatório"),
    name: Yup.string().required("O nome é obrigatóro"),
    cnpj: Yup.string().required("O CNPJ é obrigatório").typeError("Digite apenas números"),

    contact: Yup.number().required("O Campo é obrigatório"),
    email: Yup.string().required("Email orbigatório"),
    telephone:Yup.number().required("Telefone é obrigatório"),
    cell:Yup.number().required("Celular é obrigatório"),

    cep: Yup.number().min(8, "É necessário 8 digitos").required("CEP é obrigatório").typeError("Digite apenas números"),
    address: Yup.string().required("Endereço é obrigatório"),
    cityId: Yup.string().required("O id é obrigatório"),
    city: Yup.string().required("A cidade é obrigatório"),
    uf: Yup.string().required("O estado é obrigatório"),
    neighborhood: Yup.string().required("O bairro é obrigatório"),
    number: Yup.number().required("O Número é obrigatório"),
  
})

export const ProviderForm: React.FC<{
  update: () => void,
  handleModal: () => void
  provider?: IInfoProvider
  type: string
}> = ({ update, handleModal, provider, type }) => {
  const close = () => { handleModal()}

  const { formRef } = useVForm()

  const handleSave = (dados: IProviderCadastroInfo) => {
    ProviderCadastroSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        ProviderService.Create(dadosValidados).then((result) => {
          alert("Fornecedor cadastrado com sucesso!!!");
          close();
          update();
        });
      })
      .catch((erros: Yup.ValidationError) => {
        const validandoErros: { [key: string]: string } = {};
        erros.inner.forEach((erros) => {
          if (!erros.path) return;
          validandoErros[erros.path] = erros.message;
        });
        formRef.current?.setErrors(validandoErros);
      });
  }

  const handleEdit = (dados: IInfoProvider) =>{
    ProviderCadastroSchema.validate(dados,{abortEarly:false})
    .then((dadosValidados)=>{
      if(dados.id)
      ProviderService.UpdateById(dados.id, dados).then(result => {
      alert("Fornecedor editado com sucesso!!!")
      update()
      })
    })
    .catch((erros: Yup.ValidationError)=>{
      const validandoErros: {[key:string]: string} = {}
      erros.inner.forEach(erros =>{
        if(!erros.path)return
        validandoErros[erros.path] = erros.message
      })
      formRef.current?.setErrors(validandoErros)
    })
  }

  const handleSubmit = (dados: IProviderCadastroInfo | IInfoProvider) => {
    if(type === 'edit'){
      handleEdit(dados)
    }else{
      handleSave(dados)
    }
  }

  function getCepData (ev: any) {
    const {value} = ev.target
    const cep = value?.replace(/[^0-9]/g, '')
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((res) => res.json())
    .then((data) => {
      formRef.current?.setFieldValue('city', `${data.localidade}`)
      formRef.current?.setFieldValue('uf', `${data.uf}`)
      formRef.current?.setFieldValue('address', `${data.logradouro}`)
      formRef.current?.setFieldValue('neighborhood', `${data.bairro}`)
    })
  }

  return (
    <Form
      initialData={provider}
      ref={formRef}
      className="Form-Provider"
      onSubmit={(dados) => {
        dados.id = provider?.id
        handleSubmit(dados)
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        className="Container-Interior-Geral"
      >
        <Box
          height={70}
          width={"100%"}
          bgcolor={"#575A61"}
          display={"flex"}
          alignItems={"center"}
          paddingLeft={3}
        >
          <Typography
            sx={{ fontWeight: "500", fontSize: "25px", color: "#fff" }}
          >
            Cadastrar Fornecedor
          </Typography>
        </Box>
        <Box className="Container-Interior-Formulario">
          <Box display={"flex"} justifyContent={"space-around"}>
            <Box
              className="Form-Interior-Top"
              display={"flex"}
              flexDirection={"column"}
            >
              <VTextField label="Código" name="code" />
              <VTextField label="Nome" name="name" />
              <VTextField label="CNPJ" name="cnpj" />
            </Box>
            <Box
              className="Form-Interior-Top"
              display={"flex"}
              flexDirection={"column"}
            >
              <VTextField label="Contato" name="contact" />
              <VTextField label="Email" name="email" />
              <VTextField label="Fixo" name="telephone" />
              <VTextField label="Celular" name="cell" />
            </Box>
          </Box>
          <Box flex={1}>
            <Typography sx={{mt:4, ml:2,fontWeight:'500', color: '#575A61'}}>Informações de Endereço</Typography>
            <Box display={"flex"} justifyContent={"space-around"}>
              <Box className="Form-Interior-Bottom">
                <VTextField label="UF" name="uf" />
                <VTextField label="Endereço" name="address"/>
                <VTextField label="Cidade" name="city"/>
                <VTextField label="Id Cidade" name="cityId" />
              </Box>
              <Box className="Form-Interior-Bottom">
                <VTextField label="CEP" name="cep" onBlur={getCepData}/>
                <VTextField label="Bairro" name="neighborhood" />
                <VTextField label="Número Residência" name="number" />

                <Box className="Container-Botoes-Provider">
                  <Button 
                    sx={{ color: "#fff", width:100, backgroundColor:'#575A61'}}
                    type="submit"
                    variant="contained"
                    onClick={close}
                  >
                    Cancelar
                  </Button>
                  <Button
                    sx={{ color: "#fff", width:100, backgroundColor:'#575A61'}}
                    type="submit"
                    variant="contained"
                  >
                    Salvar
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Form>
  );
};