<script lang="ts">
	import '../app.css';

	import Hamburger from '$lib/icons/Hamburger.svelte';
</script>

<div class="drawer2">
	<input id="my-drawer" type="checkbox" class="drawer-toggle hidden" />
	<div class="drawer-content">
		<!-- Navbar -->
		<nav class="navbar">
			<div class=" navbar-start">
				<label for="my-drawer" class="btn btn-primary drawer-button">
					<Hamburger />
				</label>
			</div>
		</nav>

		<!-- Page content here -->
		<slot />

		<!-- Footer -->
	</div>

	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 h-full bg-base-200 text-base-content">
			<!-- Sidebar content here -->
			<li>Sidebar Item 1</li>
			<li>Sidebar Item 2</li>
		</ul>
	</div>
</div>
