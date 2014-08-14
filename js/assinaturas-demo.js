$(document).ready(function(){

  $("#assinar").click(function(){
    var token = $("#token").val();// COLOQUE AQUI O SEU TOKEN
    var plan_code = $("#plan_code").val(); // INFORME AQUI UM CÓDIGO DE UM PLANO SEU

    if(token == "" || plan_code == "") {
      alert("Informe o seu token e um código de plano valido!");
      return;
    }

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

  $("#carregar_dados").click(function(){
    fill_form();
  });

  $("#carregar_dados_novo_cartao").click(function(){
    fill_new_billing_info_form();
  });
});

var build_customer = function() {
    var customer_params = {
        fullname: $("#fullname").val(),
        email: $("#email").val(),
        code: slugify($("#fullname").val().toLowerCase()),
        fullname : $("#fullname").val(),
        cpf : $("#cpf").val(),
        birthdate_day : $("#birthdate_day").val(),
        birthdate_month: $("#birthdate_month").val(),
        birthdate_year: $("#birthdate_year").val(),
        phone_area_code: $("#ddd").val(),
        phone_number: $("#phone").val(),
        billing_info: build_billing_info(),
        address: build_address()
    }
  return new Customer(customer_params);
};

var build_billing_info = function() {
  var billing_info_params = {
      fullname : $("#holder_name").val(),
      expiration_month: $("#expiration_month").val(),
      expiration_year: $("#expiration_year").val(),
      credit_card_number: $("#credit_card").val()
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

var build_address = function() {
  var address_params = {
      street: $("#rua").val(),
      number: $("#numero").val(),
      complement: $("#complemento").val(),
      district: $("#bairro").val(),
      zipcode: $("#cep").val(),
      city: $("#cidade").val(),
      state: $("#estado").val(),
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

var fill_form = function() {
    $("#fullname").val("David Luis da Silva");
    $("#email").val("dluis@dluis.com");
    $("#holder_name").val("David L Silva");
    $("#credit_card").val("4111111111111111");
    $("#cpf").val("22222222222");
    $("#ddd").val("11");
    $("#phone").val("88886666");
    $("#rua").val("Rua dos Jogadores");
    $("#numero").val("123");
    $("#complemento").val("cobertura");
    $("#bairro").val("Jd. das Mamgabeiras");
    $("#cep").val("45555400");
    $("#cidade").val("São Paulo");
    $("#estado").val("São Paulo");
    $("#birthdate_day").val("12");
    $("#birthdate_month").val("12");
    $("#birthdate_year").val("1985");
};

var fill_new_billing_info_form = function() {
    $("#new_fullname").val("David Luis da Silva");
    $("#new_holder_name").val("David L Silva");
    $("#new_credit_card").val("4111111111111111");
};
