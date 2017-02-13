$(document).ready(function(){
  MoipAssinaturas.DEBUG_MODE = true;

  $("#assinar").click(function(){
    var token = $("#token").val();// COLOQUE AQUI O SEU TOKEN
    var plan_code = $("#plan_code").val(); // INFORME AQUI UM CÓDIGO DE UM PLANO SEU

    if(token == "" || plan_code == "") {
      alert("Informe o seu token e um código de plano valido!");
      return;
    }

    MoipAssinaturas.DEBUG_MODE = true;
    var moip = new MoipAssinaturas(token);
    var customer = build_customer();
    var subscription_code = new Date().getTime(); // INFORME AQUI UM CÓDIGO PARA ESSA ASSINATURA

    moip.subscribe(
        new Subscription()
            .with_code(subscription_code)
            .with_new_customer(customer)
            .with_plan_code(plan_code)
    ).callback(function(response){
        if (response.has_errors()) {
            $("#erros").empty();
            for (i = 0; i < response.errors.length; i++) {
              var erro = response.errors[i].description;
              $("#erros").append("<li>" + erro + "</li>");
              $(".alert").fadeIn();
            }
        } else {
          $("#to-show").removeClass("alert-error").addClass("alert-success").fadeIn();
          $("#erros").empty().append("<li>Assinatura criado com sucesso</li>");
          $("#erros").append("<li><strong>Próxima Cobrança:</strong> " + response.next_invoice_date.day + "/" + response.next_invoice_date.month + "/" + response.next_invoice_date.year + "</li>");
          $("#erros").append("<li><strong>Status do pagamento:</strong> " + response.invoice.status.description + "</li>");
          $("#erros").append("<li><strong>Status: </strong> " + response.status + "</li>")

        }
    });
  });

  $("#atualizar").click(function(){
      var token = $("#token").val();
      var moip = new MoipAssinaturas(token);

      var customer = new Customer();
      customer.code = $("#customer_code").val();
      customer.billing_info = build_new_billing_info(); //Aqui você seta um novo cartão para fazer a cobrança

      moip.update_credit_card(customer).callback(function(data){
          if(data.has_errors()){
              alert("Ops.... houveram erros");
          }else{
            alert("O cartão de credito foi atualizado");
          }
      });
  });

  $("#subscribe_with_customer").click(function(){
    var token = $("#token").val(); // INFORME AQUI UM CÓDIGO DE UM PLANO SEU
    var plan_code = $("#plan_code").val(); // INFORME AQUI UM CÓDIGO DE UM PLANO SEU
    var moip = new MoipAssinaturas(token);

    var customer = new Customer();
    customer.code = $("#existent_customer_code").val();

    moip.subscribe(
        new Subscription()
            .with_code(new Date().getTime())
            .with_customer(customer)
            .with_plan_code(plan_code)
    ).callback(function(response){
        if (response.has_errors()) {
            $("#erros").empty();
            for (i = 0; i < response.errors.length; i++) {
              var erro = response.errors[i].description;
              $("#erros").append("<li>" + erro + "</li>");
              $(".alert").fadeIn();
            }
        } else {
          $("#to-show").removeClass("alert-error").addClass("alert-success").fadeIn();
          $("#erros").empty().append("<li>Assinatura criado com sucesso</li>");
          $("#erros").append("<li><strong>Próxima Cobrança:</strong> " + response.next_invoice_date.day + "/" + response.next_invoice_date.month + "/" + response.next_invoice_date.year + "</li>");
          $("#erros").append("<li><strong>Status do pagamento:</strong> " + response.invoice.status.description + "</li>");
          $("#erros").append("<li><strong>Status: </strong> " + response.status + "</li>")

        }
    });
  });

  $("#new_customer").click(function(){
    var token = $("#token").val(); // INFORME AQUI UM CÓDIGO DE UM PLANO SEU
    var plan_code = $("#plan_code").val(); // INFORME AQUI UM CÓDIGO DE UM PLANO SEU
    var moip = new MoipAssinaturas(token);
    moip.create_customer(build_customer("#tab4"));
  });

  $(".carregar_dados").click(function(){
    fill_form("#tab1");
    fill_form("#tab4");
  });

  $("#carregar_dados_novo_cartao").click(function(){
    fill_new_billing_info_form();
  });
});

var build_customer = function(tab = "#tab1") {
    var customer_params = {
        fullname: $(tab + "  input[name=fullname]").val(),
        email: $(tab + " input[name=email]").val(),
        code: slugify($(tab + " input[name=fullname]").val().toLowerCase()),
        cpf : $(tab + " input[name=cpf]").val(),
        birthdate_day : $(tab + " input[name=birthdate_day]").val(),
        birthdate_month: $(tab + " input[name=birthdate_month]").val(),
        birthdate_year: $(tab + " input[name=birthdate_year]").val(),
        phone_area_code: $(tab + " input[name=ddd]").val(),
        phone_number: $(tab + " input[name=phone]").val(),
        billing_info: build_billing_info(),
        address: build_address()
    }
  return new Customer(customer_params);
};

var build_billing_info = function(tab = "#tab1") {
  var billing_info_params = {
      fullname : $(tab + " input[name=holder_name]").val(),
      expiration_month: $(tab + " input[name=expiration_month]").val(),
      expiration_year: $(tab + " input[name=expiration_year]").val(),
      credit_card_number: $(tab + " input[name=credit_card]").val()
  };
  return new BillingInfo(billing_info_params);
};

var build_new_billing_info = function() {
  var billing_info_params = {
      fullname : $("#new_holder_name").val(),
      expiration_month: $("#new_expiration_month").val(),
      expiration_year: $("#new_expiration_year").val(),
      credit_card_number: $("#new_credit_card").val()
  };
  return new BillingInfo(billing_info_params);
};

var build_address = function(tab = "#tab1") {
  var address_params = {
      street: $(tab + " input[name=rua]").val(),
      number: $(tab + " input[name=numero]").val(),
      complement: $(tab + " input[name=complemento]").val(),
      district: $(tab + " input[name=bairro]").val(),
      zipcode: $(tab + " input[name=cep]").val(),
      city: $(tab + " input[name=cidade]").val(),
      state: $(tab + " input[name=estado]").val(),
      country: "BRA"
  };
  return new Address(address_params);
};

var slugify = function(text) {
  text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
  text = text.replace(/-/gi, "_");
  text = text.replace(/\s/gi, "-");
  return text;
}

var fill_form = function(tab = "#tab1") {
  $(tab + " input[name=fullname]").val("David Luis da Silva");
  $(tab + " input[name=email]").val("dluis@dluis.com");
  $(tab + " input[name=holder_name]").val("David L Silva");
  $(tab + " input[name=credit_card]").val("4111111111111111");
  $(tab + " input[name=cpf]").val("22222222222");
  $(tab + " input[name=ddd]").val("11");
  $(tab + " input[name=phone]").val("88886666");
  $(tab + " input[name=rua]").val("Rua dos Jogadores");
  $(tab + " input[name=numero]").val("123");
  $(tab + " input[name=complemento]").val("cobertura");
  $(tab + " input[name=bairro]").val("Jd. das Mamgabeiras");
  $(tab + " input[name=cep]").val("45555400");
  $(tab + " input[name=cidade]").val("São Paulo");
  $(tab + " input[name=estado]").val("São Paulo");
  $(tab + " input[name=birthdate_day]").val("12");
  $(tab + " input[name=birthdate_month]").val("12");
  $(tab + " input[name=birthdate_year]").val("1985");
};

var fill_new_billing_info_form = function() {
  $("#new_fullname").val("David Luis da Silva");
  $("#new_holder_name").val("David L Silva");
  $("#new_credit_card").val("4111111111111111");
};
