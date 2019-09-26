<template>
  <v-container v-if="!isLoading" fluid grid-list-lg>
    <v-data-table
      :search="search"  
      v-model="selected"
      :headers="headers" 
      calculate-widths
      :items="data"
      item-key="_id"
      :single-select="!multiple"
      :show-select="select"
      sort-by="nome" class="elevation-1"
      hide-default-footer
      :page.sync="pagination.page"
      :items-per-page="rowsPerPage"
      @page-count="pagination.pageCount = $event" >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>
          <div class="flex-grow-1"></div>
          <v-dialog v-model="dialog" persistent  max-width="90%" >
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Novo</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ (model._id ? 'Editando' : 'Novo') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="8" md="8">
                      <v-text-field v-model="model.nome" label="Nome" v-validate="'required'"
                        data-vv-name="model.nome" :error-messages="errors.collect('model.nome')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field v-model="model.cpfcnpj" label="CPF/CNPJ" v-mask="['###.###.###-##', '##.###.###/####-##']"
                        data-vv-name="model.cpfcnpj" :error-messages="errors.collect('model.cpfcnpj')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8" md="8">
                      <v-text-field v-model="model.razaosocial" label="Razão Social"
                        data-vv-name="model.razaosocial" :error-messages="errors.collect('model.razaosocial')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field v-model="model.telefone" label="Telefone" v-mask="['(##) ####-####', '(##) #####-####']"
                        data-vv-name="model.telefone" :error-messages="errors.collect('model.telefone')" data-vv-scope="model" ></v-text-field>
                    </v-col>                    
                    <v-col cols="12" sm="8" md="7">
                      <v-text-field v-model="model.endereco.rua" label="Rua"
                        data-vv-name="model.endereco.rua" :error-messages="errors.collect('model.endereco.rua')" data-vv-scope="model" ></v-text-field>
                    </v-col>                    
                    <v-col cols="12" sm="4" md="2">
                      <v-text-field v-model="model.endereco.numero" label="Nº"
                        data-vv-name="model.endereco.numero" :error-messages="errors.collect('model.endereco.numero')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field v-model="model.endereco.complemento" label="Complemento"
                        data-vv-name="model.endereco.complemento" :error-messages="errors.collect('model.endereco.complemento')" data-vv-scope="model" ></v-text-field>
                    </v-col>                    
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="model.endereco.bairro" label="Bairro"
                        data-vv-name="model.endereco.bairro" :error-messages="errors.collect('model.endereco.bairro')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8" md="4">
                      <v-text-field v-model="model.endereco.cidade" label="Cidade"
                        data-vv-name="model.endereco.cidade" :error-messages="errors.collect('model.endereco.cidade')" data-vv-scope="model" ></v-text-field>
                    </v-col>                    
                    <v-col cols="12" sm="4" md="4">                      
                      <v-text-field v-model="model.endereco.estado" label="UF"
                        data-vv-name="model.endereco.estado" :error-messages="errors.collect('model.endereco.estado')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Voltar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="mr-2"  @click="editItem(item)" >
          edit
        </v-icon>
      </template>
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Não ha dados cadastrados
          </v-alert>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            A pesquisa não retornou dados.
          </v-alert>
        </template>
    </v-data-table>    
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pagination.pageCount" ></v-pagination>
    </div>
  </v-container>
</template>
<script>
  import app from '@/services/app'
  export default {
    name: 'component.cadastro.Pessoa',
    props: {
      value: [Object, Array], 
      view: {
        type: Boolean,
        default: false
      },
      select: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
    },
    data(){
      return {
        constSizeHeader: 270,
        constSizeRow: 48,
        itensPerPage: 10,
        search: null,        
        pagination: {page: 1, pageCount: 0, itemsPerPage: 10},
        selected: [],
        data: [],
        model: {},
        defaulModel: {endereco:{}},
        dialog: false,
        configHeaders: [
          {
            text: 'Nome',
            align: 'left',
            class: 'longText',
            value: 'nome',
          },
          {
            text: 'Endereço',
            align: 'left',
            class: 'longText',
            value: 'enderecoTxt',
          },
          {
            text: 'Telefone',
            align: 'left',
            value: 'telefone',
            notDisplay: ['xs','sm']
          },
          {
            text: 'CPF/CNPJ',
            align: 'left',
            value: 'cpfcnpjTxt',
            notDisplay: ['xs','sm']
          },
          { 
            text: 'Ações', 
            align: 'right',
            value: 'action', 
            sortable: false },
        ],
      }
    },
    async mounted(){
    },
    async created() {
      this.selected = this.value;
      this.model = this.defaulModel;
      await this.fetchData();
    },
    methods:{/*
      responsiveShortLongText(txt){
        if (this.$vuetify.breakpoint.name === 'xs'){
          return this.shortLongText(txt, 30)
        } else if (this.$vuetify.breakpoint.name === 'sm'){
          return this.shortLongText(txt, 50)
        }else if (this.$vuetify.breakpoint.name === 'md'){
          return this.shortLongText(txt, 65)
        }else if (this.$vuetify.breakpoint.name === 'lg'){
          return this.shortLongText(txt, 80)
        }else {
          return txt
        }
      },
      shortLongText(txt, maxLength ){
        return (txt.length > maxLength ? txt.substring(0,(maxLength-3)) + "..." : txt)
      },*/
      async confirm(){
        this.$emit('input', this.selected)
        this.$emit('exit', true)
      },
      async exit(){
        this.$emit('input', null)
        this.$emit('exit', true)
      },
      async fetchData (){
        var vm = this;        
        vm.$store.dispatch('app/setLoading', true, { root: true })
        await app.get('api/pessoa').then(async (response) => {
          vm.data = [];
          if (response.status === 200 && response.data && response.data.success){
            var tmpData = response.data.data || [];
            tmpData = tmpData.map(e => { 
              return Object.assign({
                cpfcnpjTxt: (e.cpfcnpj.length === 11 ? 
                            e.cpfcnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : 
                            (e.cpfcnpj.length === 15 ? e.cpfcnpj.replace(/^(\d{3})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"): e.cpfcnpj)),
                enderecoTxt: (e.endereco && e.endereco.rua ? 
                  `${e.endereco.rua}${(e.endereco.numero ? ', nº '+e.endereco.numero: '')}${(e.endereco.complemento ? ' ('+e.endereco.complemento+')': '')}${(e.endereco.bairro ? ' - '+e.endereco.bairro: '')}${(e.endereco.cidade ? ' - '+e.endereco.cidade: '')}`
                  : null)
              }, e)
            })
            vm.data = tmpData;
          }
        }).catch(error => {
          console.error('Error get pessoa: ', error)
        });        
        vm.$store.dispatch('app/setLoading', false, { root: true });      
      },
      async editItem (item) {
        var vm = this;
        vm.$store.dispatch('app/setProcessing', 'Carregando...', { root: true })
        await app.get('api/pessoa/'+item._id).then(async (response) => {
          if (response.status === 200 && response.data && response.data.success){
            this.model = response.data.data
            this.dialog = true
          }
        }).catch(error => {
          vm.$store.dispatch('app/setMessage', { type: 'error', message: 'Ops! Houve algum erro ao buscar dados. Erro: '+error }, { root: true });
        });        
        vm.$store.dispatch('app/setProcessing', null, { root: true });
      },
      async close (refreshData = false) {
        this.dialog = false
        setTimeout(() => {
          this.model = this.defaulModel;
        }, 300);
        if (refreshData === true){
          await this.fetchData()
        }
      },
      async save () {
        var vm = this;
        try {
          await vm.$validator.validateAll('model').then(async (success) => {
            vm.$store.dispatch('app/setProcessing', 'Salvando...', { root: true });
            if (success) {
              if (vm.model._id) {
                vm.model.updatedAt = Date.now
                await app.put('api/pessoa/'+vm.model._id, vm.model).then(async (response) => {
                  if (response.status === 200 && response.data && response.data.success){
                    vm.$store.dispatch('app/setMessage',{ type: 'info', message: 'Registro atualizado com sucesso!' }, { root: true });            
                    vm.$store.dispatch('app/setProcessing', null, { root: true });
                    vm.close(true)
                  } else {
                    vm.$store.dispatch('app/setMessage',{ type: 'error', message: response.data.data }, { root: true });
                    vm.$store.dispatch('app/setProcessing', null, { root: true });
                  }
                }).catch(error => {
                  vm.$store.dispatch('app/setMessage',{ type: 'error', message: error }, { root: true });
                  vm.$store.dispatch('app/setProcessing', null, { root: true });
                });
              } else {
                await app.post('api/pessoa/', vm.model).then(async (response) => {
                  // console.log("response: ", response);
                  if (response.status === 200 && response.data && response.data.success){
                    vm.$store.dispatch('app/setMessage',{ type: 'info', message: 'Registro criado com sucesso!' }, { root: true });
                    vm.$store.dispatch('app/setProcessing', null, { root: true });
                    vm.close(true)
                  } else {
                    vm.$store.dispatch('app/setMessage',{ type: 'error', message: response.data.data }, { root: true });
                    vm.$store.dispatch('app/setProcessing', null, { root: true });
                  }
                }).catch(error => {
                  vm.$store.dispatch('app/setMessage',{ type: 'error', message: error }, { root: true });
                  vm.$store.dispatch('app/setProcessing', null, { root: true });
                });                       
              }
            } else {
              vm.$store.dispatch('app/setProcessing', null, { root: true });
            }
          });
        } catch (error) {
          vm.$store.dispatch('app/setProcessing', null, { root: true });
          vm.$store.dispatch('app/setMessage',{type: 'error',
                                                    message: 'Erro ao Salvar Dados. Erro: '+error
                                                    }, { root: true });
        }
      }
    },
    computed: {
      user(){
        return this.$store.getters.getters['authentication/authUser']
      },
      isLoading: function () {
        return this.$store.getters['app/isLoading']
      },
      headers(){
        var headers = this.configHeaders
        Object.keys(headers).map(e=> {
          if (headers[e] && Array.isArray(headers[e].notDisplay) && headers[e].notDisplay.indexOf(this.$vuetify.breakpoint.name) > -1) {
            delete headers[e];
          }
        })
        // console.log('headers: ', headers);
        return headers;
      },
      rowsPerPage () {
        const itemSize = (window.innerWidth < 600 ?  (Object.keys(this.headers).length * this.constSizeRow ):  this.constSizeRow);
        const headerSize = (window.innerWidth < 600 ?  (this.constSizeHeader + 56):  this.constSizeHeader);
        // console.log('Altura linha: ', itemSize);
        // console.log('Altura Pagina: ', window.innerHeight);
        const sizeDispe = window.innerHeight - headerSize;
        // console.log('Altura Disponivel para dados: ', sizeDispe);
        const itensPorPage = Math.floor(sizeDispe / itemSize);
        return itensPorPage 
      }
    },
    watch:{

    }
  }

</script>

<style scoped>
  .longText {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 30%;
  }
</style>
