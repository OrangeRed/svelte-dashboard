<script lang="ts">
	import '../app.css';

	import Hamburger from '$lib/icons/Hamburger.svelte';
</script>

<div class="drawer xl:drawer-open overflow-y-scroll h-full">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" hidden />

	<div class="drawer-content">
		<!-- Navbar -->
		<nav class="navbar">
			<div class="navbar-start">
				<label for="my-drawer" class="btn bg-transparent drawer-button xl:hidden">
					<Hamburger />
				</label>
				Navbar Start
			</div>
		</nav>

		<!-- Page content -->
		<slot />

		<!-- Footer -->
		<!-- 
		<footer class="footer footer-center">
			<div>Hello</div>
		</footer>
		-->
	</div>

	<div class="drawer-side">
		<label for="my-drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-32 h-full bg-base-200 text-base-content">
			<!-- Sidebar content -->
			<li>Overview</li>
			<li>Assets</li>
			<li>Credit</li>
		</ul>
	</div>
</div>
