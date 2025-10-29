import { Router } from 'express';

import {
  handleCreateTodo,
  handleDeleteTodo,
  handleListTodos,
  handleToggleTodo,
  handleUpdateTodo,
} from '../controllers/todoController';

const router = Router();

router.get('/', handleListTodos);
router.post('/', handleCreateTodo);
router.put('/:id', handleUpdateTodo);
router.patch('/:id/toggle', handleToggleTodo);
router.delete('/:id', handleDeleteTodo);

export default router;
