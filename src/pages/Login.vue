<script>
export default {
  name: 'Login'
}
</script>
<template>
    <div>
      <h1>Login Page</h1>
      <form>
        <label for="email">Email:</label>
        <input type="email" id="email" required />
        
        <label for="password">Password:</label>
        <input type="password" id="password" required />
        
        <button type="submit">Login</button>
      </form>
    </div>
  </template>