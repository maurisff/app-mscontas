<template>
  <v-card>    
  <v-autocomplete
    v-model="model"
    :items="data"
    :loading="isLoading"
    :search-input.sync="search"
    :readonly="(model && !multiple ? true : false)"
    :multiple="multiple"
    chips
    clearable
    hide-details
    hide-selected
    item-text="nome"
    item-value="_id"
    label="Pessoa"
    placeholder="Informe o nome da pessoa"
    solo
    return-object >
    <template v-slot:no-data>
      <v-list-item v-if="search && !isLoading" @click="CriarPessoa(search)">
        <v-list-item-title>
          {{(search ? `Nenhuma pessoa cadastrada como ${search}. Cadastra-la?` : '')}}
        </v-list-item-title>
      </v-list-item>
      <div v-else></div>
    </template>
    <template v-slot:selection="{ attr, on, item, selected }">
      <v-chip
        v-bind="attr"
        :input-value="selected"
        class="ma-2"
        color="primary"
        v-on="on"
        label
        :close="multiple"
        @click:close="removeModel(item)"
        >
        <span v-text="item.nome"></span>
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-content>
        <v-list-item-title v-text="item.nome+(cpfcnpjTxt(item) ? ` (${cpfcnpjTxt(item)})` : '')"></v-list-item-title>
        <v-list-item-subtitle v-text="enderecoTxt(item)"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
  <cadastroPessoa v-model="model" createData="createData" ><cadastroPessoa>
  </v-card>
</template>
<script>
  import app from '@/services/app'
  
  import cadastroPessoa from '@/components/cadastro/Pessoa/Pessoa'
  export default {
    name: 'component.cadastro.InputPessoa',
    components: {
      cadastroPessoa,
    },
    data(){
      return {
        model: null,
        data: [],
        search: null,
        isLoading: false,
        createData: false
      }
    },
    props: {
      value: [Object, Array], 
      multiple: {
        type: Boolean,
        default: false
      },
    },
    watch:{
      value (val) {
        if (val===null || val===undefined){
          this.model = val
        } else if (this.model===null || this.model===undefined){
          this.model = val
        } else if (this.model !== val) {
          this.model = val
        }
      },
      model (val) {
        this.search = null
        this.createData = false
        this.$emit('input', val)
      },
      async search (val) {
        var vm = this
        if (!val && !this.model) {  
          vm.data = [];
          return
        }
        // Items have already been loaded
        if (vm.data.length > 0) return

        vm.isLoading = true
        await app.get('api/pessoa').then(async (response) => {
          vm.data = [];
          if (response.status === 200 && response.data && response.data.success){
            vm.data = response.data.data || [];
          }
        }).catch(error => {
          console.error('Error get pessoa: ', error)
        })
        vm.isLoading = false;
      },
    },
    methods:{
      removeModel (item) {
        const index = this.model.map(e => {return e._id}).indexOf(item._id)
        if (index >= 0) this.model.splice(index, 1)
      },
      cpfcnpjTxt(val){
        return (val.cpfcnpj.length === 11 ? 
                            val.cpfcnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : 
                            (val.cpfcnpj.length === 15 ? val.cpfcnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"): val.cpfcnpj))

      },
      enderecoTxt(val){
        return (val.endereco && val.endereco.rua ? 
                  `${val.endereco.rua}${(val.endereco.numero ? ', nº '+val.endereco.numero: '')}${(val.endereco.complemento ? ' ('+val.endereco.complemento+')': '')}${(val.endereco.bairro ? ' - '+val.endereco.bairro: '')}${(val.endereco.cidade ? ' - '+val.endereco.cidade: '')}`
                  : null)

      },
      CriarPessoa(name){        
        this.$store.dispatch('app/setMessage',{ type: 'info', message: 'Debug... Adicionando nova Pessoa: '+ name}, { root: true });
        this.createData = true
      }
    },
    mounted(){
    },
    created() {
      this.model = this.value;
    },
    computed: {
    }
  }

</script>

<style scoped>

</style>
