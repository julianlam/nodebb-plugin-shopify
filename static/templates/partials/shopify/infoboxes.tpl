<!-- BEGIN matches -->
<div class="shopify-infobox">
	<div class="media">
		<div class="media-left">
			<!-- IF productUrlPrefix -->
			<a href="{productUrlPrefix}{../handle}">
				<img class="media-object not-responsive" src="{../image.src}" alt="{../title}">
			</a>
			<!-- ELSE -->
			<img class="media-object not-responsive" src="{../image.src}" alt="{../title}">
			<!-- ENDIF productUrlPrefix -->
		</div>
		<div class="media-body">
			<h4 class="media-heading">
				<!-- IF productUrlPrefix -->
				<a href="{productUrlPrefix}{../handle}">{../title}</a>
				<!-- ELSE -->
				{../title}
				<!-- ENDIF productUrlPrefix -->
				<span class="text-muted">
					by
					<!-- IF vendorUrlPrefix -->
					<a href="{vendorUrlPrefix}{../vendor}">{../vendor}</a>
					<!-- ELSE -->
					{../vendor}
					<!-- ENDIF vendorUrlPrefix -->
				</span>
			</h4>

			<!-- IF typeUrlPrefix -->
			<small>See other <a href="{typeUrlPrefix}{../product_type}">{../product_type}</a></small>
			<!-- ENDIF typeUrlPrefix -->
		</div>
	</div>
</div>
<!-- END matches -->