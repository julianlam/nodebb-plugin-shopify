
<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">Status</div>
	<div class="col-sm-10 col-xs-12 well">
		<ul>
			<li>
				<!-- IF ready -->
				<i class="fa fa-circle text-success"></i> Ready
				<!-- ELSE -->
				<i class="fa fa-circle text-danger"></i> Not Ready
				<!-- ENDIF ready -->
			</li>
			<li>Curating {numProducts} products</li>
		</ul>
	</div>
</div>

<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">Authentication</div>
	<div class="col-sm-10 col-xs-12">
		<form role="form" class="shopify-settings">
			<div class="form-group">
				<label for="key">API Key</label>
				<input type="text" id="key" name="key" class="form-control" />
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input type="text" id="password" name="password" class="form-control" />
			</div>
			<div class="form-group">
				<label for="shopname">Shop Name</label>
				<input type="text" id="shopname" name="shopname" class="form-control" />
				<p class="help-block">
					Your Shopify <em>Shop Name</em> is your subdomain (e.g. "myshop.shopify.com")
				</p>
			</div>
		</form>
	</div>
</div>

<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header">Customise Infobox</div>
	<div class="col-sm-10 col-xs-12">
		<form role="form" class="shopify-settings">
			<div class="form-group">
				<label for="productUrlPrefix">Product URL Prefix</label>
				<input type="text" class="form-control" id="productUrlPrefix" name="productUrlPrefix" placeholder="https://example.org/products/" />
			</div>
			<div class="form-group">
				<label for="vendorUrlPrefix">Vendor URL Prefix</label>
				<input type="text" class="form-control" id="vendorUrlPrefix" name="vendorUrlPrefix" placeholder="https://example.org/collections/vendors?q=" />
			</div>
			<div class="form-group">
				<label for="typeUrlPrefix">Product Type URL Prefix</label>
				<input type="text" class="form-control" id="typeUrlPrefix" name="typeUrlPrefix" placeholder="https://example.org/collections/types?q=" />
			</div>
		</form>
	</div>
</div>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>